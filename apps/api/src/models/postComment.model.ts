import { POST_COMMENT_STATUS, PostCommentStatus } from "@odiano/shared";
import mongoose, { Schema, Types } from "mongoose";

type PostCommentSchema = {
    author : Types.ObjectId,
    postId : Types.ObjectId,
    parentId : Types.ObjectId | null,
    depth : number,
    replyCount : number,
    content : string,
    status : PostCommentStatus,
}

const postCommentSchema = new Schema<PostCommentSchema>({
    content : {
        type : String,
        required : true,
    },
    author : {
        type : Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },
    postId: {
        type : Types.ObjectId,
        ref : "Post",
        required : true,
        index : true,
    },
    parentId : {
        type : Types.ObjectId,
        ref : "PostComment",
        required : false,
    },
    depth : {
        type : Number,
        default : 0,
        index: true,
    },
    replyCount : {
        type : Number,
        default : 0,
    },
    status : {
        type : String,
        enum : Object.values(POST_COMMENT_STATUS),
        default : POST_COMMENT_STATUS.ACTIVE,
    }
}, {timestamps : true});

const PostComment = mongoose.model("PostComment", postCommentSchema);
export default PostComment;