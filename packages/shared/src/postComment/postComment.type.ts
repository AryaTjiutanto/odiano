import { UserSummaryDTO } from "../user"

export type PostCommentDTO = {
    id : string,
    parentId : string,
    content : string,
    author : UserSummaryDTO,
    depth : number,
    replyCount : number,
    createdAt : Date,
}