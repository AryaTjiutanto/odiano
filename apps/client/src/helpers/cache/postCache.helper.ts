import type { PostDTO } from "@connect/shared"
import type { InfiniteQueryPostDTO } from "../../types/post.type"

export function applyLikeToInfinitePostCache(oldData: InfiniteQueryPostDTO, postId: string): InfiniteQueryPostDTO {
    return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => {
                return {

                    ...item,
                    ...((item.id == postId && !item.isLiked) && {
                        isLiked: true,
                        likeCount: item.likeCount + 1,
                    })
                }
            })
        }))
    }
}

export function removeLikeFromInfinitePostCache(oldData: InfiniteQueryPostDTO, postId: string): InfiniteQueryPostDTO {
    return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => {
                return {
                    ...item,
                    ...((item.id == postId && item.isLiked) && {
                        isLiked: false,
                        likeCount: item.likeCount - 1,
                    })
                }
            })

        }))
    }
}

export function applyLikeToPostCache (oldData : PostDTO) : PostDTO {
    return {
        ...oldData,
        ...(!oldData.isLiked && {
            isLiked : true,
            likeCount : oldData.likeCount + 1,
        })
    }
}

export function removeLikeFromPostCache (oldData : PostDTO) : PostDTO {
    return {
        ...oldData,
        ...(oldData.isLiked && {
            isLiked : false,
            likeCount : oldData.likeCount - 1,
        })
    }
}