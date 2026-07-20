import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ImageAsset } from "../types/user.type";
import { AUTH_PROVIDERS, AuthProviders } from "../consts/user.const";

// types for schema
type AuthenticationSchema = {
    providerId : string | null,
    provider : AuthProviders
}

type UserSchema = {
    email: string,
    username: string,
    
    password: string | null,
    authentication : AuthenticationSchema,

    dateOfBirth: string | null,
    name: string | null,
    bio: string | null,
    isOnboarded: boolean,
    emailVerifiedAt: Date | null,
    profileImage: ImageAsset | null,
    coverImage: ImageAsset | null,
    followingCount : number,
    followerCount : number
}

// schema
const profileImageSchema = new mongoose.Schema<ImageAsset>({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: false,
    }
}, { _id: false })

const coverImageSchema = new mongoose.Schema<ImageAsset>({
    url : {
        type : String,
        required : true,
    },
    publicId : {
        type : String,
        required : true,
    }
}, {_id : false});

const authenticationSchema = new mongoose.Schema<AuthenticationSchema>({
    providerId : {
        type : String,
        required : false,
    },
    provider : {
        type : String,
        enum : Object.values(AUTH_PROVIDERS),
        required : true,
    }
});

const userSchema = new mongoose.Schema<UserSchema>({
    email: {
        required: true,
        type: String,
        unique: true
    },
    username: {
        required: true,
        type: String,
        index : true,
    },

    password: {
        required: false,
        type: String,
        default : null,
    },
    authentication : {
        required : true,
        type : authenticationSchema,
        default : {
            providerId : null,
            provider : AUTH_PROVIDERS.LOCAL,
        }
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
    dateOfBirth : {
        type : String,
        required : false,
    },
    profileImage: {
        type: profileImageSchema,
        required: false,
        default: null,
    },
    coverImage : {
        type : coverImageSchema,
        required : false,
        default : null
    },
    isOnboarded: {
        type: Boolean,
        required: true,
        default: false,
    },
    emailVerifiedAt: {
        type: Date,
        default: null,
    },
    followerCount : {
        type : Number,
        default : 0,
    },
    followingCount : {
        type : Number,
        default : 0
    }
}, { timestamps: true, toJSON : {versionKey : false} });

userSchema.pre("save", async function () {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
})

// create model
export const User = mongoose.model<UserSchema>("User", userSchema);