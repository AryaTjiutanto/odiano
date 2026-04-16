import { ErrorResponseCode, SuccessResponseCode } from "../consts"

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
    error : T | null,
}