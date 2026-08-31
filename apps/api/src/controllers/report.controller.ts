import { Response, NextFunction } from "express";
import { ReqBody } from "../types/request.type";
import { CreateReport, SUCCESS_RESPONSE_CODE } from "@odiano/shared";
import { createReport } from "../services/report.service";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { successResponseData } from "../utils/response.util";

export const create = async (req : ReqBody<CreateReport>, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const {reason, targetId, type} = req.body;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        await createReport(currentUserId, reason, type, targetId);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "Report created successfully"));
    } catch (err) {
        next(err);
    }
}