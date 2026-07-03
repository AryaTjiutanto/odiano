import { ErrorResponseCode, SuccessResponseCode } from "./response.const"

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

export type InfiniteQuery<T> = {
    nextCursor : string | null,
    hasNextPage : boolean,
    items : T,
}

export type ValidationError = {
    path : string,
    message : string,
}

export type TooManyRequestError = {
    timeLeftMs : number,
}

export type FailedAttemptError = {
    attemptLeft : number
}

export type CreatedDocumentId = {
    id : string,
}