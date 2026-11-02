import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { getAllSession } from "../services/session.service.js";
import { successResponseData } from "../utils/response.util.js";
import { SessionDTO, SUCCESS_RESPONSE_CODE } from "@odiano/shared";

export const getSessions = async (req : Request, res : Response, next : NextFunction) => {
    const {userId, sessionId} = req;

    if(!userId || !sessionId) { 
        throw new UnauthorizedError();
    }

    const data = await getAllSession(userId, sessionId);

    res.status(200).json(successResponseData<SessionsDTO>(SUCCESS_RESPONSE_CODE.success, "success", data));
};