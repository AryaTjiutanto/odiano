import { ErrorResponseCode, SuccessResponseCode } from "./response-code.const"

export type SuccessResponseData<T = null> = {
    success: true,
    code: SuccessResponseCode,
    message: string,
    data: T | null,
}

export type ErrorResponseData<T = null> = {
    success : false,
    code : ErrorResponseCode,
    message : string,
    errors : T | null,
}

export type ValidationError = {
    path : string,
    message : string,
}