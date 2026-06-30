import { type Post as PostType, type PostMedia, ALLOWED_MEDIA_PROVIDERS, ALLOWED_MEDIA_TYPES, POST_VISIBILITIES} from "@connect/shared"
import mongoose, { Types } from "mongoose"
import { nanoid } from "nanoid";

// type for schema 
type PostSchema = PostType & {
    publicId : string,
    author: Types.ObjectId,
}

// post media schema
const postMediaSchema = new mongoose.Schema<PostMedia>({
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
        enum : Object.values(ALLOWED_MEDIA_PROVIDERS)
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
        enum : Object.values(ALLOWED_MEDIA_TYPES)
    },
});

// post schema

const postSchema = new mongoose.Schema<PostSchema>({
    author: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    publicId : {
        type : String,
        unique : true,
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
        enum : Object.values(POST_VISIBILITIES),
        required : true,
    },
    media : {
        type : postMediaSchema,
        required : false,
        default : null,
    },
    commentCount : {
        type : Number,
        default : 0,
    },
    likeCount : {
        type : Number,
        default : 0
    }
}, { timestamps: true, toJSON : {versionKey : false} })

postSchema.pre("save", async function() {
    if(!this.publicId) {
        this.publicId = nanoid(8);
    }
});

// create model
export const Post = mongoose.model("Post", postSchema);