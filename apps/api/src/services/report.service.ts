import { REPORT_STATUS, ReportReasonCode, ReportType } from "@odiano/shared";
import Report from "../models/report.model";
import { Types } from "mongoose";

export const createReport = async (currentUserId : string, reason : ReportReasonCode, type : ReportType, targetId : string) => {
    await Report.updateOne({
        reason,
        type,
        target: new Types.ObjectId(targetId),
        reporter: new Types.ObjectId(currentUserId),
    }, {
        $setOnInsert: {
            status: REPORT_STATUS.PENDING,
        }
    }, {
        upsert: true,
    });
}