import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import slugify from "slugify";

type UserSchema = {
    email : string,
    password : string,
    dateOfBirth : string,
    name : string | null,
    username : string | null,
    slug : string | null,
    bio : string |null,
    profileImage : ProfileImageSchema,
}

type ProfileImageSchema = {
    url : string,
    publicId : string,
}

const profileImageSchema = new mongoose.Schema({
    url : {
        type : String,
        required : true,
    },
    publicId : {
        type : String,
        required : true,
    }
}, {_id : false})

const userSchema = new mongoose.Schema<UserSchema>({
    email : {
        required : true,
        type : String,
        unique : true
    },
    password : {
        required : true,
        type : String,
    },
    username : {
        required : false,
        type: String,
        default : null,
    },
    slug : {
        required : false,
        type : String,
        unique : true,
        default : null,
    },
    name : {
        required : false,
        type : String,
        default : null,
    },
    bio : {
        required : false,
        type : String,
        default : null,
    },
    profileImage : {
        type : profileImageSchema,
        required : false,
        default : null,
    }
}, {timestamps : true});

userSchema.pre("save", async function () {
    if(this.isModified("password")) {   
        this.password = await bcrypt.hash(this.password, 12);
    }
    
    if(this.isModified("username")) {
        if(!this.username) {
            return;
        }
        
        const uniqueId = nanoid(6);
        const baseSlug = slugify(this.username, {lower:true, trim:true});

        this.slug = `${baseSlug}-${uniqueId}`;
    }
})

export const User = mongoose.model<UserSchema>("User", userSchema);