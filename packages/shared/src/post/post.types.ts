import { AllowedMediaProviders, AllowedMediaTypes, PostVisibilities } from "./post.const"

export type MediaSource = {
    url : string,
    publicId : string,
}

export type PostMedia = {
    width : number,
    height : number,
    provider : AllowedMediaProviders,
    type : AllowedMediaTypes
    order : number,
    source : MediaSource,
}

export type Post = {
    // content
    content: string,
    media : PostMedia[] | null,

    // setting
    visibility: PostVisibilities,
    hideLikeAndViewCount: boolean,
    turnOffCommenting: boolean,
    isArchive: boolean,
}

export type PostPublicId = {
    publicId : string,
}