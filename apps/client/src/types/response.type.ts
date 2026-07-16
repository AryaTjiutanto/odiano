import { ERROR_RESPONSE_CODE, type ErrorResponseData, type FailedAttemptError, type TooManyRequestError, type ValidationError } from "@connect/shared"
import type { AxiosError } from "axios"

export type ValidationErrorResponse = ErrorResponseData<ValidationError[]> & {
    code : typeof ERROR_RESPONSE_CODE.validationError,
}

export type FailedAttemptErrorResponse = ErrorResponseData<FailedAttemptError> & {
    code : typeof ERROR_RESPONSE_CODE.failedAttempt,
}

export type TooManyRequestErrorResponse = ErrorResponseData<TooManyRequestError> & {
    code : typeof ERROR_RESPONSE_CODE.tooManyRequests,
}

export type ForbiddenErrorResponse = ErrorResponseData & {
    code : typeof ERROR_RESPONSE_CODE.forbidden,
}

export type ConflictErrorResponse = ErrorResponseData & {
    code : typeof ERROR_RESPONSE_CODE.conflict
}

export type BadRequestErrorResponse = ErrorResponseData & {
    code : typeof ERROR_RESPONSE_CODE.badRequest
}

export type UnauthorizedErrorResponse = ErrorResponseData & {
    code : typeof ERROR_RESPONSE_CODE.unauthorized
}

export type AllErrorResponse = ValidationErrorResponse | FailedAttemptErrorResponse | TooManyRequestErrorResponse | ForbiddenErrorResponse | ConflictErrorResponse | BadRequestErrorResponse | UnauthorizedErrorResponse;

export type AxiosErrorResponseData = AxiosError<ErrorResponseData>