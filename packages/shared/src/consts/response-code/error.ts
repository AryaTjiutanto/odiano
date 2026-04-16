export const ERROR_RESPONSE_CODE = {
    badRequest: "BAD_REQUEST",
    unauthorized: "UNAUTHORIZED",
    forbidden: "FORBIDDEN",
    notFound: "NOT_FOUND",
    conflict: "CONFLICT",
    unprocessableEntity: "UNPROCESSABLE_ENTITY",
    tooManyRequests: "TOO_MANY_REQUESTS",
    internalServerError: "INTERNAL_SERVER_ERROR",
    serviceUnavailable: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorResponseCode = typeof ERROR_RESPONSE_CODE[keyof typeof ERROR_RESPONSE_CODE];