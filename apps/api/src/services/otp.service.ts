import { AUTH_CACHE_KEYS, DEFAULT_OTP_EXPIRES_TIME, ERROR_RESPONSE_CODE, OTP_PURPOSES, OtpChannels, OtpPurposes } from "@odiano/shared";
import OTP from "../models/otp.model.js";
import { customAlphabet } from "nanoid";
import { render } from "@react-email/components";
import React from "react";
import { getCache, setCache } from "@odiano/redis";
import { AppError } from "../errors/appError.error.js";
import { JOB_NAMES, QUEUE_NAMES, registerEmailJob } from "@odiano/queue";

import bcrypt from "bcrypt";
import VerifyEmail from "../emails/verifyEmail.js";
import NewDeviceLoginEmail from "../emails/NewDeviceLogin.js";
import { getSessionDevice } from "../utils/userAgent.util.js";

type VerifyEmailData = {
    purpose : typeof OTP_PURPOSES.VERIFY_EMAIL,
}

type NewDeviceLoginData = {
    purpose : typeof OTP_PURPOSES.NEW_DEVICE_LOGIN,
    userAgent : string | undefined | null,
}

type Data = (VerifyEmailData | NewDeviceLoginData) & {
    target : string
};

export const createAndSendOTP = async (email:string, channel: OtpChannels, data : Data) => {
    // check send email verification attempt
    const sendEmailVerificationCacheKey = AUTH_CACHE_KEYS.SEND_OTP(data.target);

    const emailVerificationAttempt = parseInt(await getCache(sendEmailVerificationCacheKey) || "0");

    if (emailVerificationAttempt >= 3) {
        throw new AppError(
            429,
            ERROR_RESPONSE_CODE.tooManyRequests,
            "You've reached the maximum number of OTP resend requests."
        );
    }

    // create and send otp
    const code = String(customAlphabet("0123456789", 6)());

    const otp = await OTP.create([{
        expiresAt: new Date(Date.now() + DEFAULT_OTP_EXPIRES_TIME),
        code,
        attempt: 0,
        channel,
        purpose : data.purpose,
        target : data.target,
    }]);


    let content;

    switch (data.purpose) {
        case OTP_PURPOSES.VERIFY_EMAIL:
            content = await render(React.createElement(VerifyEmail, {
                code,
                expiresIn: DEFAULT_OTP_EXPIRES_TIME / 1000,
            }));

            break;
        case OTP_PURPOSES.NEW_DEVICE_LOGIN:
            const device = data.userAgent ? getSessionDevice(data.userAgent) : null;

            content = await render(React.createElement(NewDeviceLoginEmail, {
                code,
                os : device?.os,
                browser : device?.browser,
                expiresIn: 10 * 60,
            }));

            break;
    }

    registerEmailJob(JOB_NAMES[QUEUE_NAMES.EMAIL].SEND_OTP, {
        id: `email-otp-${otp[0]._id.toString()}`,
        email: email,
        content,
    })

    // increase send email verification attempt
    await setCache(sendEmailVerificationCacheKey, emailVerificationAttempt + 1, { PX: 1 * 24 * 60 * 60 * 1000 });
}

export const verifyOTP = async (target: string, code: string, purpose: OtpPurposes) => {
    const otp = await OTP.findOne({ target, purpose }).sort({ createdAt: -1 }).select("_id +code expiresAt attempt");

    if (!otp) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Invalid code");
    }

    if (otp.expiresAt < new Date()) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Code expired");
    }

    if (otp.attempt >= 3) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Too many attempts");
    }

    const isValid = await bcrypt.compare(code, otp.code);

    if (!isValid) {
        otp.attempt += 1;
        await otp.save();
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Invalid code");
    }

    await otp.deleteOne();
}