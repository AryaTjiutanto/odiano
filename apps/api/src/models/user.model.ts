import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import slugify from "slugify";

type User = {
    name : string,
    username : string,
    slug : string,
    email : string,
    password : string,
}

const userSchema = new mongoose.Schema<User>({
    name : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        select : false,
    },
    slug : {
        type : String,
        required : false,
        unique : true,        
    }
}, {timestamps: true});

userSchema.pre("save", async function () {
    if(this.isModified("password")) {   
        this.password = await bcrypt.hash(this.password, 12);
    }
    
    if(this.isModified("username")) {
        const uniqueId = nanoid(6);
        const baseSlug = slugify(this.username, {lower:true, trim:true});

        this.slug = `${baseSlug}-${uniqueId}`;
    }
})

export const User = mongoose.model<User>("User", userSchema);