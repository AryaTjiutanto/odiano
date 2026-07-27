import { AUTH_CACHE_KEYS, DEFAULT_OTP_EXPIRES_TIME, ERROR_RESPONSE_CODE, OtpChannels, OtpPurposes } from "@odiano/shared";
import OTP from "../models/otp.model";
import { customAlphabet } from "nanoid";
import { emailQueue, EmailQueueData } from "@odiano/queue";
import { render } from "@react-email/components";
import React from "react";
import { getCache, setCache } from "@odiano/redis";
import { AppError } from "../errors/appError.error";

import bcrypt from "bcrypt";
import logger from "../libs/log/logger";
import VerifyEmail from "../emails/verifyEmail";

export const createAndSendOTP = async (target: string, channel: OtpChannels, purpose: OtpPurposes) => {
    // check send email verification attempt
    const sendEmailVerificationCacheKey = AUTH_CACHE_KEYS.SEND_OTP(target);

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
        purpose,
        target,
    }]);

    const content = await render(React.createElement(VerifyEmail, {
        code,
        expiresIn: DEFAULT_OTP_EXPIRES_TIME / 1000,
    }));

    emailQueue.add("send-otp", {
        id: `email-otp-${otp[0]._id.toString()}`,
        email: target,
        content,
    } satisfies EmailQueueData, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: 3000,
        removeOnFail: 5000,
    });

    // increase send email verification attempt
    await setCache(sendEmailVerificationCacheKey, emailVerificationAttempt + 1, { PX: 1 * 24 * 60 * 60 * 1000 });
}

export const verifyOTP = async (target: string, code: string, purpose: OtpPurposes) => {
    const otp = await OTP.findOne({ target, purpose }).sort({ createdAt: -1 }).select("_id +code expiresAt attempt");

    logger.info({
        _id : otp?._id,
        expiresAt : otp?.expiresAt,
        attempt : otp?.attempt,
    })

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