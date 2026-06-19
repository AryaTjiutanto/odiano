import PostComment from "../models/postComment.model"

type createPostCommentParams = {
    content : string,
    ownerId : string,
    postId : string,
    parentId : string | null | undefined,
    depth : number
}

export const create = async ({content, ownerId, postId, parentId, depth} : createPostCommentParams) => {
    await PostComment.create({
        content,
        ownerId,
        postId,
        parentId,
        depth,
    })
}