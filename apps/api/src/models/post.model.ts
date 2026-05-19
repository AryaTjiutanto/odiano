import mongoose, { Types } from "mongoose"

type Source = {
    url : string,
    publicId : string,
}

type PostMediaSchema = {
    width : number,
    height : number,
    provider : "cloudinary" | "s3",
    type : "video" | "image"
    order : number,
    source : Source,
}

type PostSchema = {
    authorId: Types.ObjectId,

    // content
    content: string,
    media : PostMediaSchema | null,

    // setting
    visibility: "public" | "following",
    hideLikeAndViewCount: boolean,
    turnOffCommenting: boolean,
    isArchive: boolean,
}

const postMediaSchema = new mongoose.Schema<PostMediaSchema>({
    height : {
        required : true,
        type : Number,
    },
    width : {
        required : true,
        type : Number,
    },
    order : {
        required : true,
        type : Number,
    },
    provider : {
        required : true,
        type : String,
        enum : ["cloudinary", "s3"]
    },
    source : {
        url : {
            type : String,
            required : true,
        },
        publicId : {
            type : String,
            required : true,
        }
    },
    type : {
        required : true,
        type : String,
        enum : ["cloudinary", "s3"]
    }
}, {timestamps : true});

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
    },
    media : {
        type : postMediaSchema,
        required : false,
        default : null,
    }
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema);