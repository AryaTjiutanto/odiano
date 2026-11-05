export const SESSION_STATUS = {
    ACTIVE : "active",
    REVOKED : "revoked",
} as const;

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];
