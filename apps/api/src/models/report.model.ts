import { REPORT_REASON_CODES, REPORT_STATUS } from "@odiano/shared";
import { model, Schema, Types } from "mongoose";
import { ReportSchema } from "../types/report.type.js";

const reportSchema = new Schema<ReportSchema>({
    reason: {
        type: String,
        enum: Object.values(REPORT_REASON_CODES),
        required: true,
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
        type: Schema.Types.Mixed,
        required: true,
    }
}, { timestamps: true });

reportSchema.index({
    reporter: 1,
    reason: 1,
    "target.id": 1,
    "target.type": 1,
}, {unique: true});

const Report = model<ReportSchema>("Report", reportSchema);

export default Report;