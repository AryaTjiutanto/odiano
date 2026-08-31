import { REPORT_STATUS, ReportReasonCode, ReportType } from "@odiano/shared";
import Report from "../models/report.model";
import { Types } from "mongoose";

export const createReport = async (currentUserId : string, reason : ReportReasonCode, type : ReportType, targetId : string) => {
    await Report.create({
        reason,
        type,
        status: REPORT_STATUS.PENDING,
        reporter: new Types.ObjectId(currentUserId),
        target: new Types.ObjectId(targetId),
    });
}