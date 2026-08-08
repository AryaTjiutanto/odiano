import { type Post as PostType, type PostMedia, ALLOWED_MEDIA_PROVIDERS, ALLOWED_MEDIA_TYPES, POST_VISIBILITIES } from "@odiano/shared"
import mongoose, { Types } from "mongoose"
import { nanoid } from "nanoid";

// type for schema 
type PostSchema = PostType & {
    publicId: string,
    author: Types.ObjectId,
}

// post media schema
const postMediaSchema = new mongoose.Schema<PostMedia>({
    aspectRatio: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
            validator: (value: unknown) => {
                return (
                    typeof value === "number" ||
                    value === "original"
                );
            },
            message: "Aspect ratio must be a number or 'original'",
        },
    },
    order: {
        required: true,
        type: Number,
    },
    provider: {
        required: true,
        type: String,
        enum: Object.values(ALLOWED_MEDIA_PROVIDERS)
    },
    source: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        }
    },
    type: {
        required: true,
        type: String,
        enum: Object.values(ALLOWED_MEDIA_TYPES)
    },
});

// post schema
const postSchema = new mongoose.Schema<PostSchema>({
    author: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    publicId: {
        type: String,
        unique: true,
    },
    content: {
        type: String,
        required: false,
    },
    hideLikeAndViewCount: {
        type: Boolean,
        required: true,
    },
    isArchive: {
        type: Boolean,
        required: true,
    },
    turnOffCommenting: {
        type: Boolean,
        required: true
    },
    visibility: {
        type: String,
        enum: Object.values(POST_VISIBILITIES),
        required: true,
    },
    media: {
        type: [postMediaSchema],
        required: false,
        default: null,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    likeCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true, toJSON: { versionKey: false } })

postSchema.pre("save", async function () {
    if (!this.publicId) {
        this.publicId = nanoid(8);
    }
});

// create model
export const Post = mongoose.model("Post", postSchema);