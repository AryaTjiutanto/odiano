import { ERROR_RESPONSE_CODE, SessionDTO, SessionsDTO } from "@odiano/shared";
import { Session } from "../models/session.model.js";
import { Types } from "mongoose";
import { AppError } from "../errors/appError.error.js";

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
    return await Session.create({
        device: {
            userAgent,
            deviceId
        },
        userId,
        lastActive: new Date(),
    })
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

    const document = await Session.findOneAndDelete({
        _id : sessionId,
        userId,
    });

    if(!document) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "Session Not found");
    }
}