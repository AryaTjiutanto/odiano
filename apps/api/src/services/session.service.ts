import { AUTH_CACHE_KEYS, AUTH_TOKEN, ERROR_RESPONSE_CODE, SESSION_STATUS, SessionCache, SessionsDTO, SessionStatus } from "@odiano/shared";
import { Session } from "../models/session.model.js";
import { Types } from "mongoose";
import { AppError } from "../errors/appError.error.js";
import { getCache, setCache } from "@odiano/redis";
import { Response } from "express";
import { RefreshToken } from "../models/refreshToken.model.js";
import { authCookieOptions } from "../libs/auth/auth.cookie.js";
import addTimeToCurrentDate from "../utils/addTimeToCurrentDate.js";

export const updateExistsSession = async (deviceId: string, userAgent: string | null, userId: Types.ObjectId): Promise<Types.ObjectId | null> => {
    const session = await Session.findOneAndUpdate({
        userId: new Types.ObjectId(userId),
        "device.deviceId": deviceId
    }, {
        $set: {
            device: {
                userAgent: userAgent,
                deviceId: deviceId,
            },
            lastLogin: new Date(),
            status: SESSION_STATUS.ACTIVE,
            expire_at: null
        }
    })

    if (!session) {
        return null;
    }

    await setSessionCache(session._id.toString(), userId.toString(), SESSION_STATUS.ACTIVE);

    return session._id;
};

export const updateOrCreateSession = async (deviceId: string, userAgent: string | null, userId: Types.ObjectId): Promise<Types.ObjectId> => {
    const session = await Session.findOneAndUpdate({
        userId: new Types.ObjectId(userId),
        "device.deviceId": deviceId
    }, {
        $set: {
            device: {
                userAgent: userAgent,
                deviceId: deviceId,
            },
            lastLogin: new Date(),
            status: SESSION_STATUS.ACTIVE,
            expire_at: null
        }
    }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    })

    await setSessionCache(session._id.toString(), userId.toString(), SESSION_STATUS.ACTIVE);

    return session._id;
};

export const createSession = async (deviceId: string, userAgent: string | null, userId: Types.ObjectId) => {
    const session = await Session.create({
        device: {
            userAgent,
            deviceId
        },
        userId,
        lastLogin: new Date(),
    })

    await setSessionCache(session._id.toString(), userId.toString());

    return session;
}

export const getActiveSession = async (userId: string, sessionId: string): Promise<SessionsDTO> => {
    const sessions = await Session.find({ userId, status: SESSION_STATUS.ACTIVE }).select("_id device lastLogin");

    const formattedSessions = sessions.map(session => ({
        id: session._id.toString(),
        lastLogin: session.lastLogin,
        device: {
            deviceId: session.device.deviceId,
            userAgent: session.device.userAgent,
        }
    }));

    return {
        currentSession: formattedSessions.find(session => session.id == sessionId),
        otherSessions: formattedSessions.filter(session => session.id !== sessionId),
    }
}

export const revokeSession = async (userId: string, sessionId: string | null | undefined) => {
    if (!sessionId) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "bad request");
    }

    // update session status
    const document = await Session.findOneAndUpdate({
        _id: sessionId,
    }, {
        $set: {
            status: SESSION_STATUS.REVOKED,
            expire_at: addTimeToCurrentDate(14 * 24 * 60 * 60 * 1000)
        }
    });

    if (!document) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "Session Not found");
    }

    // update cache
    await setSessionCache(sessionId, userId, SESSION_STATUS.REVOKED);

    // delete refresh token
    await RefreshToken.deleteOne({
        sessionId
    })
}

export const checkSessionStatus = async (userId: string, sessionId: string): Promise<SessionStatus | null> => {
    // get cache
    const cache = await getCache<SessionCache>(AUTH_CACHE_KEYS.SESSION(sessionId));

    if (cache) {
        return cache.status;
    }

    // get session
    const session = await Session.findOne({ _id: sessionId }).select("status userId");

    if (!session) {
        return null;
    }

    // set cache
    await setSessionCache(sessionId, userId);

    return session.status;
}

export const validateRequestSession = async (res: Response, userId: string, sessionId: string) => {
    const sessionStatus = await checkSessionStatus(userId, sessionId);

    if (!sessionStatus) {
        throw new AppError(401, ERROR_RESPONSE_CODE.noSession, "no session");
    }

    if (sessionStatus == SESSION_STATUS.REVOKED) {
        res.clearCookie(AUTH_TOKEN.REFRESH, authCookieOptions());
        throw new AppError(401, ERROR_RESPONSE_CODE.revokedSession, "revoked session");
    }
}

export const setSessionCache = async (sessionId: string, userId: string, status: SessionStatus = SESSION_STATUS.ACTIVE) => {
    await setCache(AUTH_CACHE_KEYS.SESSION(sessionId), {
        status,
        userId
    } satisfies SessionCache, {
        PX: 5 * 24 * 60 * 60 * 10000,
    });
}