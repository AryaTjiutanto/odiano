export const ROLES = {
    ADMIN: "admin",
    USER: "user",
    MODERATOR : "moderator",
}

export type Role = typeof ROLES[keyof typeof ROLES]