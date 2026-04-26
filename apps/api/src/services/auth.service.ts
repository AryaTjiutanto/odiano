import { AUTH_TOKEN, AuthToken, UserDTO } from "@connect/shared";
import { AppError } from "../errors/appError.error";
import { generateAccessToken, generateRefreshToken } from "../libs/auth/jwt";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { RefreshToken } from "../models/refreshToken.mode";
import { nanoid } from "nanoid";

const oneDayAge = 1 * 24 * 60 * 60 * 1000;

export const signIn = async (email: string, password: string): Promise<AuthToken> => {
    const currentUser = await User.findOne({ email }).select("+password").lean();

    if (!currentUser) {
        throw new AppError(400, "BAD_REQUEST", "Email or Password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, currentUser.password);

    if (!isPasswordValid) {
        throw new AppError(400, "BAD_REQUEST", "Email or Password is wrong");
    }

    const userId = currentUser._id.toString();
    const accessToken = generateAccessToken({ id: userId });
    const refreshToken = await createRefreshToken(userId);

    return {
        [AUTH_TOKEN.ACCESS]: accessToken,
        [AUTH_TOKEN.REFRESH]: refreshToken,
    };
}

export const signUp = async (dateOfBirth : string, email: string, password: string): Promise<AuthToken> => {
    const user = await User.findOne({ email }).lean();

    if (user) {
        throw new AppError(409, "CONFLICT", "Email already used");
    }

    const currentUser = await User.create({
        email,
        password,
        dateOfBirth
    });

    const userId = currentUser._id.toString();
    const accessToken = generateAccessToken({ id: userId });
    const refreshToken = await createRefreshToken(userId);

    return {
        [AUTH_TOKEN.ACCESS]: accessToken,
        [AUTH_TOKEN.REFRESH]: refreshToken,
    };
}

export const me = async (userId: string): Promise<UserDTO> => {
    const user = await User.findById(userId).lean();

    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User not found");
    }

    return {
        id: user?._id.toString(),
        email: user?.email,
        slug: user?.slug,
        username: user?.username,
    }
}

export const refresh = async (userId: string, tokenId: string, token: string) : Promise<AuthToken> => {
    const refreshToken = await RefreshToken.findOne({ tokenId });

    if (!refreshToken) {
        throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
    }

    const isTokenValid = await bcrypt.compare(token, refreshToken.tokenHash);

    if (!isTokenValid) {
        throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
    }

    if (Date.now() > refreshToken.expiresAt.getTime()) {
        throw new AppError(401, "UNAUTHORIZED", "Token expired");
    }

    if (refreshToken.userId.toString() !== userId) {
        throw new AppError(401, "UNAUTHORIZED", "Invalid owner token");
    }

    const newAccessToken = generateAccessToken({id : userId});
    const newRefreshToken = await createRefreshToken(userId);

    await refreshToken.deleteOne();

    return {
        [AUTH_TOKEN.ACCESS] : newAccessToken,
        [AUTH_TOKEN.REFRESH] : newRefreshToken,
    }
}

export const createRefreshToken = async (userId: string) => {
    const tokenId = nanoid(12);

    const refreshToken = generateRefreshToken({ id: userId, tokenId});

    await RefreshToken.create({
        tokenHash: refreshToken,
        tokenId,
        userId: userId,
        expiresAt: new Date(Date.now() + oneDayAge * 30)
    })

    return refreshToken;
}