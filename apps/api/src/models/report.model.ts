import { REPORT_REASON_CODES, REPORT_STATUS, REPORT_TYPE, ReportReasonCode, ReportStatus, ReportType } from "@odiano/shared";
import { model, Schema, Types } from "mongoose";

type ReportSchema = {
    reason: ReportReasonCode,
    type: ReportType,
    status: ReportStatus,
    reporter: Types.ObjectId,
    target: Types.ObjectId,
}

const reportSchema = new Schema<ReportSchema>({
    reason: {
        type: String,
        enum: Object.values(REPORT_REASON_CODES),
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(REPORT_TYPE),
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(REPORT_STATUS),
        index : true,
    },
    reporter: {
        type: Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    target: {
        type: Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });

reportSchema.index({
    reporter: 1,
    target: 1,
    reason: 1,
    type: 1,
}, {unique: true});

const Report = model<ReportSchema>("Report", reportSchema);

export default Report;