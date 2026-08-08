import { UserSummaryDTO } from "../user"
import { AllowedMediaProviders, AllowedMediaTypes, MediaAspectRatio, PostVisibilities } from "./post.const"

export type MediaSource = {
    url: string,
    publicId: string,
}

export type PostMedia = {
    aspectRatio: MediaAspectRatio,
    provider: AllowedMediaProviders,
    type: AllowedMediaTypes
    order: number,
    source: MediaSource,
}

export type Post = {
    // content
    content: string,
    media: PostMedia[] | null,
    commentCount : number,
    likeCount : number,

    // setting
    visibility: PostVisibilities,
    hideLikeAndViewCount: boolean,
    turnOffCommenting: boolean,
    isArchive: boolean,
}

export type PostPublicId = {
    publicId: string,
}

export type PostDTO = Post & {
    id: string,
    publicId: string,
    author?: UserSummaryDTO,
    createdAt: Date,
    isLiked : boolean,
}