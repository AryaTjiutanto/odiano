import { ErrorResponseCode, SuccessResponseCode } from "./response.const.js"

export type SuccessResponseData<T = null> = {
    success: true,
    code: SuccessResponseCode,
    message: string,
    data: T | null,
}

export type ErrorResponseData<T = null> = {
    success: false,
    code: ErrorResponseCode,
    message: string,
    errors: T | null,
}

export type ValidationError = {
    path: string,
    message: string,
}

export type TooManyRequestError = {
    timeLeftMs: number,
}

export type FailedAttemptError = {
    attemptLeft: number
}

export type CreatedDocumentId = {
    id: string,
    publicId?: string,
}

// query result
export type PaginationData = {
    totalPage: number,
    totalItem: number,
    itemPerPage: number,
}

export type PaginationQuery<T> = {
    pagination: PaginationData | null,
    data: T,
}

export type InfiniteQuery<T> = {
    nextCursor: string | null,
    hasNextPage: boolean,
    items: T,
}