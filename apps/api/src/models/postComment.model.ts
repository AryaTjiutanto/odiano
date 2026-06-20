import mongoose, { Schema, Types } from "mongoose";

type PostCommentSchema = {
    author : Types.ObjectId,
    postId : Types.ObjectId,
    parentId : Types.ObjectId | null,
    depth : number,
    replyCount : number,
    content : String,
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
    },
    postId: {
        type : Types.ObjectId,
        ref : "Post",
        required : true,
    },
    parentId : {
        type : Types.ObjectId,
        ref : "PostComment",
        required : false,
    },
    depth : {
        type : Number,
        default : 0,
    },
    replyCount : {
        type : Number,
        default : 0,
    },
}, {timestamps : true});

const PostComment = mongoose.model("PostComment", postCommentSchema);
export default PostComment;