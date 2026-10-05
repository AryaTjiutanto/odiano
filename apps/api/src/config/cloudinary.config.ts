import "../bootstraps/env.bootstrap.js";
import {v2 as cloudinary} from "cloudinary";

const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env;

if(!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env is missing");
}

cloudinary.config({
    cloud_name : CLOUDINARY_CLOUD_NAME,
    api_key : CLOUDINARY_API_KEY,
    api_secret : CLOUDINARY_API_SECRET
})

export default cloudinary;