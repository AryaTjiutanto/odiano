import mongoose, { Schema, Types } from "mongoose";

type PostCommentSchema = {
    ownerId : Types.ObjectId,
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
    ownerId : {
        type : Types.ObjectId,
        required : true,
    },
    postId: {
        type : Types.ObjectId,
        required : true,
    },
    parentId : {
        type : Types.ObjectId,
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