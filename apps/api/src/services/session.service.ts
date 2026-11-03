import { AUTH_CACHE_KEYS, ERROR_RESPONSE_CODE, SessionCache, SessionDTO, SessionsDTO } from "@odiano/shared";
import { Session } from "../models/session.model.js";
import { Types } from "mongoose";
import { AppError } from "../errors/appError.error.js";
import { delCache, getCache, setCache } from "@odiano/redis";
import { useId } from "react";
import { RefreshToken } from "../models/refreshToken.model.js";

export const findOrCreateSession = async (deviceId: string, userAgent: string | null, userId: Types.ObjectId): Promise<Types.ObjectId> => {
    let session;
    session = await Session.findOne({
        "device.deviceId": deviceId,
        userId,
    }).select("_id");

    if (!session) {
        session = await createSession(deviceId, userAgent, userId);
    }

    return session._id;
};

export const createSession = async (deviceId: string, userAgent: string | null, userId: Types.ObjectId) => {
    const session = await Session.create({
        device: {
            userAgent,
            deviceId
        },
        userId,
        lastActive: new Date(),
    })

    await setSessionCache(session._id.toString(), userId.toString());

    return session;
}

export const getAllSession = async (userId: string, sessionId : string): Promise<SessionsDTO> => {
    const sessions = await Session.find({ userId }).select("_id device lastActive logoutAt");
    
    const formattedSessions = sessions.map(session => ({
        id: session._id.toString(),
        lastActive: session.lastActive,
        logoutAt: session.logoutAt,
        device: {
            deviceId : session.device.deviceId,
            userAgent : session.device.userAgent,
        }
    }));

    return {
        currentSession : formattedSessions.find(session => session.id == sessionId),
        otherSessions : formattedSessions.filter(session => session.id !== sessionId),
    }
}

export const deleteSession = async (userId : string, sessionId : string | null | undefined) => {
    if(!sessionId) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "bad request");
    }

    // delete session
    const document = await Session.findOneAndDelete({
        _id : sessionId,
        userId,
    });

    if(!document) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "Session Not found");
    }

    // delete cache
    await delCache(AUTH_CACHE_KEYS.SESSION(sessionId));

    // delete refresh token
    await RefreshToken.deleteOne({
        sessionId
    })
}

export const checkIsSessionValid = async (userId : string, sessionId : string) : Promise<Boolean> => {
    const cache = await getCache<SessionCache>(AUTH_CACHE_KEYS.SESSION(sessionId));

    if(cache) {
        return cache.status == "active";
    }

    return !!(await Session.exists({
        userId,
        _id : sessionId
    }));
} 

export const setSessionCache = async (sessionId : string, userId : string) => {
    await setCache(AUTH_CACHE_KEYS.SESSION(sessionId), {
        status : "active",
        userId
    } satisfies SessionCache, {
        PX : 5 * 24 * 60 * 60 * 10000,
    });
}