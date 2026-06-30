import { model, Schema, Types } from "mongoose"
import { LIKE_TYPES, LikeTypes } from "../consts/like.const";

type LikeSchema = {
    user: Types.ObjectId,
    targetId: Types.ObjectId,
    type: LikeTypes,
}

const likeSchema = new Schema<LikeSchema>({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    targetId: {
        type: Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(LIKE_TYPES),
    }
}, {timestamps : true});

likeSchema.index({
    user: 1,
    type: 1,
    targetId: 1,
}, { unique: true })

const Like = model("Like", likeSchema);
export default Like;