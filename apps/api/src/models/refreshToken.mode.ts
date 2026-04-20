import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt";

type RefreshToken = {
    tokenId : string,
    tokenHash : string,
    userId : Types.ObjectId,
    expiresAt : Date,
}

const refreshTokenSchema = new mongoose.Schema<RefreshToken>({
    tokenId : {
        type : String,
        required : true,
        unique : true,
    },
    tokenHash : {
        type : String,
        required : true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
        index : true,
    },
    expiresAt : {
        type : Date,
        required : true,
    },
}, {timestamps : true});

refreshTokenSchema.index({expiresAt: 1}, {expireAfterSeconds : 0});

refreshTokenSchema.pre("save", async function () {
    if(this.isModified("tokenHash")) {
        this.tokenHash = await bcrypt.hash(this.tokenHash, 12);
    }
})

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);