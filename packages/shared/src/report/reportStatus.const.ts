export const REPORT_STATUS = {
    PENDING : "pending",
    REVIEWING : "reviewing",
    RESOLVED : "resolved",
    REJECTED : "rejected",
}

export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];