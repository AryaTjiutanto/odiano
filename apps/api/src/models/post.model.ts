import mongoose, { Types } from "mongoose"

type PostSchema = {
    authorId: Types.ObjectId,

    // content
    content: string,

    // setting
    visibility: "public" | "following",
    hideLikeAndViewCount: boolean,
    turnOffCommenting: boolean,
    isArchive: boolean,
}

const postSchema = new mongoose.Schema<PostSchema>({
    authorId: {
        type: Types.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    hideLikeAndViewCount: {
        type: Boolean,
        required: true,
    },
    isArchive: {
        type: Boolean,
        required: true,
    },
    turnOffCommenting : {
        type : Boolean,
        required : true
    },
    visibility : {
        type : String,
        enum : ["public", "following"],
        required : true,
    }
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema);