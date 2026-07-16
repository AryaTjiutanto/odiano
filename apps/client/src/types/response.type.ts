import type { ERROR_RESPONSE_CODE, ErrorResponseData, FailedAttemptError, TooManyRequestError, ValidationError } from "@connect/shared"
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

export type AllErrorResponse = ValidationErrorResponse | FailedAttemptErrorResponse | TooManyRequestErrorResponse | ForbiddenErrorResponse

export type AxiosErrorResponseData = AxiosError<ErrorResponseData>