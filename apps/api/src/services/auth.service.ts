import { AUTH_TOKEN, AuthToken, CurrentUserDTO, ERROR_RESPONSE_CODE } from "@connect/shared";
import { AppError } from "../errors/appError.error";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../libs/auth/auth.token";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { RefreshToken } from "../models/refreshToken.mode";
import { nanoid } from "nanoid";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { delCache, getCache, setCache } from "../libs/redis";
import { failedAttemptHandler } from "../helpers/attempts/failedAttemptHandler.helper";
import { tooManyAttemptHandler } from "../helpers/attempts/tooManyAttemptHandler.helper";

const oneDayAge = 1 * 24 * 60 * 60 * 1000;

export const signIn = async (email: string, password: string, ip: string): Promise<AuthToken> => {
    const MAX_EMAIL_SIGNIN_ATTEMPT = 3;
    const MAX_SIGNIN_ATTEMPT = MAX_EMAIL_SIGNIN_ATTEMPT * 6;

    // get, check and increase signin attempt
    const signinAttemptsCacheKey = `auth:signin:attempts:ip:${ip}`;
    let signinAttempts = Number(await getCache(signinAttemptsCacheKey)) | 0;

    if (signinAttempts >= MAX_SIGNIN_ATTEMPT) {
        return tooManyAttemptHandler({cacheKey : signinAttemptsCacheKey, message : "Too many sign-in requests detected."});
    }

    signinAttempts++;
    await setCache(signinAttemptsCacheKey, signinAttempts, { PX: 6 * 60 * 60 * 1000 });


    // get and check email signin attempt 
    const emailSigninAttemptsCacheKey = `auth:signin:attempts:${email}:${ip}`
    let attempt = Number(await getCache(emailSigninAttemptsCacheKey) || 0);

    if (attempt >= MAX_EMAIL_SIGNIN_ATTEMPT) {
        return tooManyAttemptHandler({cacheKey : emailSigninAttemptsCacheKey, message : "Too many sign-in attempts for this account."});
    }

    // check is user exist
    const currentUser = await User.findOne({ email }).select("+password").lean();

    if (!currentUser) {
        return failedAttemptHandler({
            cacheKey : emailSigninAttemptsCacheKey,
            MAX_ATTEMPT : MAX_EMAIL_SIGNIN_ATTEMPT,
            message : "Email or Password is wrong",
            attempt
        })
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, currentUser.password);

    if (!isPasswordValid) {
        return failedAttemptHandler({
            cacheKey : emailSigninAttemptsCacheKey,
            MAX_ATTEMPT : MAX_EMAIL_SIGNIN_ATTEMPT,
            message : "Email or Password is wrong",
            attempt
        })
    }

    // create auth token
    const userId = currentUser._id.toString();
    const accessToken = generateAccessToken({ userId });
    const refreshToken = await createRefreshToken(userId);

    // delete attempt cache
    await delCache(emailSigninAttemptsCacheKey);

    return {
        [AUTH_TOKEN.ACCESS]: accessToken,
        [AUTH_TOKEN.REFRESH]: refreshToken,
    };
}

export const signUp = async (dateOfBirth: string, email: string, password: string, ip : string): Promise<AuthToken> => {
    const MAX_SIGNUP_COUNT = 2;

    // get and check signup count
    const cacheKey = `auth:signup:count:ip:${ip}`;
    let count = Number(await getCache(cacheKey)) | 0;

    if(count >= MAX_SIGNUP_COUNT) {
        return tooManyAttemptHandler({cacheKey, message : "You have create too many account."});
    }

    // check is email already used
    const user = await User.findOne({ email }).lean();

    if (user) {
        throw new AppError(409, ERROR_RESPONSE_CODE.conflict, "Email already used");
    }

    // create user
    const currentUser = await User.create({
        slug: nanoid(5),
        email,
        password,
        dateOfBirth
    });

    // generate auth token
    const userId = currentUser._id.toString();
    const accessToken = generateAccessToken({ userId });
    const refreshToken = await createRefreshToken(userId);

    // increate signup count
    count++;
    await setCache(cacheKey, count, {PX : oneDayAge});

    return {
        [AUTH_TOKEN.ACCESS]: accessToken,
        [AUTH_TOKEN.REFRESH]: refreshToken,
    };
}

export const me = async (userId: string): Promise<CurrentUserDTO> => {
    const user = await User.findById(userId).lean();

    if (!user) {
        throw new AppError(404, ERROR_RESPONSE_CODE.conflict, "User not found");
    }

    return {
        id: user?._id.toString(),
        email: user?.email,
        slug: user?.slug,
        username: user?.username,
        isOnboarded: user?.isOnboarded,
        name: user?.name,
        profileImage: user?.profileImage
    }
}

export const refresh = async (userId: string, tokenId: string, token: string): Promise<AuthToken> => {
    const refreshToken = await RefreshToken.findOne({ tokenId });

    if (!refreshToken) {
        throw new UnauthorizedError();
    }

    const isTokenValid = await bcrypt.compare(token, refreshToken.tokenHash);

    if (!isTokenValid) {
        throw new UnauthorizedError();
    }

    if (Date.now() > refreshToken.expiresAt.getTime()) {
        throw new AppError(401, ERROR_RESPONSE_CODE.unauthorized, "Token expired");
    }

    if (refreshToken.userId.toString() !== userId) {
        throw new AppError(401, ERROR_RESPONSE_CODE.unauthorized, "Invalid owner token");
    }

    const newAccessToken = generateAccessToken({ userId });
    const newRefreshToken = await createRefreshToken(userId);

    await refreshToken.deleteOne();

    return {
        [AUTH_TOKEN.ACCESS]: newAccessToken,
        [AUTH_TOKEN.REFRESH]: newRefreshToken,
    }
}

export const createRefreshToken = async (userId: string) => {
    const tokenId = nanoid(12);

    const refreshToken = generateRefreshToken({ userId, tokenId });

    await RefreshToken.create({
        tokenHash: refreshToken,
        tokenId,
        userId: userId,
        expiresAt: new Date(Date.now() + oneDayAge * 30)
    })

    return refreshToken;
}

export const logout = async (refreshToken: string) => {
    try {
        const decoded = verifyRefreshToken(refreshToken);

        const result = await RefreshToken.deleteOne({ tokenId: decoded.tokenId });

        return result;
    } catch {

    }
};