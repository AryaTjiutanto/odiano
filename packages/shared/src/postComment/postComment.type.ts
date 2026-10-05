import { UserSummaryDTO } from "../user/index.js"

export type PostCommentDTO = {
    id : string,
    parentId : string | null | undefined,
    content : string,
    author : UserSummaryDTO,
    depth : number,
    replyCount : number,
    createdAt : Date,
    isPosted? : boolean,
}