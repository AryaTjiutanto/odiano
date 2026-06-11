import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserProfileImageSchema } from "../types/user.type";
// types for schema
type UserSchema = {
    email: string,
    password: string,
    dateOfBirth: string | null,
    name: string | null,
    username: string | null,
    bio: string | null,
    isOnboarded: boolean,
    emailVerifiedAt: Date | null,
    profileImage: UserProfileImageSchema | null,
}

// profile image schema
const profileImageSchema = new mongoose.Schema<UserProfileImageSchema>({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    }
}, { _id: false })

// user schema
const userSchema = new mongoose.Schema<UserSchema>({
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
    },
    username: {
        required: false,
        type: String,
        default: null,
    },
    name: {
        required: false,
        type: String,
        default: null,
    },
    bio: {
        required: false,
        type: String,
        default: null,
    },
    profileImage: {
        type: profileImageSchema,
        required: false,
        default: null,
    },
    isOnboarded: {
        type: Boolean,
        required: true,
        default: false,
    },
    emailVerifiedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true, toJSON : {versionKey : false} });

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
})

// create model
export const User = mongoose.model<UserSchema>("User", userSchema);