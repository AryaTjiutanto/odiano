export const AUTH_TOKEN = {
    ACCESS : "access_token", 
    REFRESH : "refresh_token",
} as const;

export type AuthToken = Record<typeof AUTH_TOKEN[keyof typeof AUTH_TOKEN], string>;