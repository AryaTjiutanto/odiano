import { ErrorResponseCode, ErrorResponseData, SuccessResponseCode, SuccessResponseData } from "@odiano/shared"

export const successResponseData = <T = null>(code : SuccessResponseCode, message: string, data : T | null = null) : SuccessResponseData<T> => {
    return {
        success : true,
        code,
        message,
        data,
    }
}

export const errorResponseData = <T = null>(code : ErrorResponseCode, message : string, errors : T | null = null) : ErrorResponseData<T> => {
    return {
        success : false,
        code,
        message,
        errors,
    }
}