import type { CurrentUserDTO, PostCommentDTO, PostDTO } from "@odiano/shared"
import type { CreateCommentMutationParams, InfiniteQueryPostDTO } from "../../types/post.type"

// post
export function removePostFromUserPostCache(oldData: InfiniteQueryPostDTO, postId: string): InfiniteQueryPostDTO {
    return {
        ...oldData,
        pages: oldData.pages.map(page => ({
            ...page,
            items: page.items.filter((item) => item.id !== postId)
        }))
    }
}

export function addPostToUserPostCache(oldData: InfiniteQueryPostDTO, postData : PostDTO): InfiniteQueryPostDTO {
    return {
        ...oldData,
        pages: oldData.pages.map((page, index) => {
            if(index == 0) {
                return {
                    ...page,
                    items: [
                        postData,
                        ...page.items,
                    ]
                }
            } 

            return {
                ...page,
            }
        })
    }
}

// like
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

export function applyLikeToPostCache(oldData: PostDTO): PostDTO {
    return {
        ...oldData,
        ...(!oldData.isLiked && {
            isLiked: true,
            likeCount: oldData.likeCount + 1,
        })
    }
}

export function removeLikeFromPostCache(oldData: PostDTO): PostDTO {
    return {
        ...oldData,
        ...(oldData.isLiked && {
            isLiked: false,
            likeCount: oldData.likeCount - 1,
        })
    }
}

// comment
export function increaseCommentCount(oldData: PostDTO) {
    return {
        ...oldData,
        commentCount: oldData.commentCount + 1
    }
}

export function decreaseCommentCount(oldData: PostDTO) {
    return {
        ...oldData,
        commentCount: oldData.commentCount - 1
    }
}

export function updateToPostedCommentData(oldData: PostCommentDTO[], commentId: string, newId: string) {
    return oldData.map((comment) => {
        return {
            ...(comment.id == commentId ? {
                ...comment,
                id: newId,
                isPosted: true
            } : comment)
        }
    })
}

export function addToComment(mutationData: CreateCommentMutationParams, oldData: PostCommentDTO[], currentUser: CurrentUserDTO | null): PostCommentDTO[] | undefined {
    if (!currentUser) return;

    return [
        {
            author: {
                id: currentUser.id,
                name: currentUser.name,
                profileImage: currentUser.profileImage,
                username: currentUser.username,
            },
            content: mutationData.data.content,
            createdAt: new Date(),
            depth: 0,
            id: mutationData.commentId,
            parentId: null,
            replyCount: 0,
            isPosted: false,
        },
        ...oldData,
    ]
}

export function removeComment(oldData: PostCommentDTO[], commentId: string) {
    return oldData.filter((comment) => comment.id !== commentId);
}