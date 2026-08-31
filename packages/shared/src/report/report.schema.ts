import { z } from "zod";
import { REPORT_REASON_CODES } from "./reportReason.const";
import { REPORT_TYPE } from "./reportType.const";

export const createReport = z.object({
    reason : z.enum(Object.values(REPORT_REASON_CODES)),
    type : z.enum(Object.values(REPORT_TYPE)),
    targetId : z.string().min(1).max(100),
})

export type CreateReport = z.infer<typeof createReport>;