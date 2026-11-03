export type SessionDTO = {
    id: string,
    device: {
        deviceId : string | null,
        userAgent: string | null,
    }
    lastActive: Date | null,
    logoutAt: Date | null,
}

export type SessionsDTO = {
    currentSession : SessionDTO | undefined | null,
    otherSessions : SessionDTO[],
}

export type SessionCache = {
    userId : string,
    status : "active" | "revoked",
}