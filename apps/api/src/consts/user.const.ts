export const AUTH_PROVIDERS = {
    LOCAL : "local" as const,
    GOOGLE : "google" as const,
}

export type AuthProviders = typeof AUTH_PROVIDERS[keyof typeof AUTH_PROVIDERS]