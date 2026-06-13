export const ERROR_RESPONSE_CODE = {
    validationError : "VALIDATION_ERROR",
    failedAttempt : "FAILED_ATTEMPT",
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

export const SUCCESS_RESPONSE_CODE = {
    ok: "OK",
    success: "SUCCESS",
    created: "CREATED",
    deleted : "DELETED",
} as const;

export type SuccessResponseCode = typeof SUCCESS_RESPONSE_CODE[keyof typeof SUCCESS_RESPONSE_CODE];