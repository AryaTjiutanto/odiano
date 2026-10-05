import "../bootstraps/env.bootstrap.js"
import { googleClient } from "../libs/google/client.js"
import { User } from "../models/user.model.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { createAuthSession } from "./auth.service.js";
import { AuthToken, ERROR_RESPONSE_CODE } from "@odiano/shared";
import { AUTH_PROVIDERS } from "../consts/user.const.js";
import { nanoid } from "nanoid";
import { AppError } from "../errors/appError.error.js";

export const authentication = async (credential: string): Promise<AuthToken> => {
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload();

    if (!payload) {
        throw new UnauthorizedError();
    }

    // check is user exist
    const currentUser = await User.findOne({ "authentication.providerId": payload.sub }).select("_id").lean();

    // signin
    if (currentUser) {
        const token = await createAuthSession(currentUser._id);

        return token;
    }

    // create account
    const isUserExist = await User.findOne({ email: payload.email }).select("_id").lean();

    if (isUserExist) {
        throw new AppError(
            409,
            ERROR_RESPONSE_CODE.conflict,
            "This email is already registered with email and password."
        );
    }

    const user = await User.create({
        email: payload.email,
        profileImage: {
            publicId: null,
            url: payload.picture
        },
        name: payload.name,
        authentication: {
            provider: AUTH_PROVIDERS.GOOGLE,
            providerId: payload.sub,
        },
        username: `user_${nanoid(5).toLowerCase()}`,
        emailVerifiedAt: Date.now(),
    })

    const token = await createAuthSession(user._id);

    return token;
}