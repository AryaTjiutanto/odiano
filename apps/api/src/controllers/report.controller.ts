import { Request, Response, NextFunction } from "express";
import { ReqBody } from "../types/request.type";
import { CreateReport, PaginationQuery, ReportDTO, SUCCESS_RESPONSE_CODE } from "@odiano/shared";
import * as reportService from "../services/report.service";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { successResponseData } from "../utils/response.util";

export const getAll = async(req : Request, res : Response, next : NextFunction) => {
    const { status, page, withPagination } = req.query;

    try {
        const reports = await reportService.getReports(status && String(status), page ? Number(page) : 1, String(withPagination) === "true");

        res.status(200).json(successResponseData<PaginationQuery<ReportDTO[]>>(SUCCESS_RESPONSE_CODE.ok, "ok", reports));
    } catch (err) {
        next(err);
    }
}

export const create = async (req : ReqBody<CreateReport>, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const {reason, targetId, type} = req.body;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        await reportService.createReport(currentUserId, reason, type, targetId);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "Report created successfully"));
    } catch (err) {
        next(err);
    }
}

export const process = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const { id } = req.params;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        await reportService.processReport(currentUserId, String(id));

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.ok, "Report processed successfully"));
    } catch (err) {
        next(err);
    }
}

export const takeAction = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const { id } = req.params;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        await reportService.takeAction(currentUserId, String(id));

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.ok, "Report taken action successfully"));
    } catch (err) {
        next(err);
    }
}