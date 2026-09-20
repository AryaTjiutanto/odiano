import { model, Schema, Types } from "mongoose";
import { AppError } from "../errors/appError.error";
import { ERROR_RESPONSE_CODE } from "@odiano/shared";

type FollowingSchema = {
    userId : Types.ObjectId,
    followUserId : Types.ObjectId,
}

const followingSchema = new Schema<FollowingSchema>({
    userId : {
        type : Types.ObjectId,
        required : true,
    },
    followUserId : {
        type : Types.ObjectId,
        required : true,
    }
}, {timestamps : true})

// prevent duplicate follow
followingSchema.index({
    userId : 1,
    followUserId : 1,
}, {unique : true})

// efficient following query
followingSchema.index({
    userId : 1,
    _id : -1
})

// efficient followers query
followingSchema.index({
    followUserId : 1,
    _id : -1
})

followingSchema.pre("save", async function() {
    if(this.userId.equals(this.followUserId)) {
        throw new AppError(403, ERROR_RESPONSE_CODE.forbidden, "You cannot follow your own account");
    }
})

export const Following = model("Following", followingSchema);