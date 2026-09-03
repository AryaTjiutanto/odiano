import type { ReportStatus } from "@odiano/shared";

const mainKey = "report"

export const reportKeys = {
    list : (status : ReportStatus) => [mainKey, "list", status],
    pagination : (status : ReportStatus) => [mainKey, "pagination", status],
};