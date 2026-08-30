export const REPORT_TYPE = {
    POST: "post",
    COMMENT: "comment",
    USER: "user",
} as const;

export type ReportType = typeof REPORT_TYPE[keyof typeof REPORT_TYPE];