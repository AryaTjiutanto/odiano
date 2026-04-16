import { ErrorResponseCode, ErrorResponseData, SuccessResponseCode, SuccessResponseData } from "@connect/shared"

export const successResponseData = <T = null>(code : SuccessResponseCode, message: string, data : T) : SuccessResponseData<T> => {
    return {
        success : true,
        code,
        message,
        data,
    }
}

export const errorResponseData = <T = null>(code : ErrorResponseCode, message : string, error : T) : ErrorResponseData<T> => {
    return {
        success : false,
        code,
        message,
        error,
    }
}