import mongoose from "mongoose"

type Media = {
    url : string,
    publicId : string,
    provider : string,
    type : "video" | "image"
}

type PostMediaSchema = {
    width : string,
    height : string,
    media : Media,
}

const postMediaSchema = new mongoose.Schema<PostMediaSchema>({

})

export const PostMedia = mongoose.model("PostMedia", postMediaSchema);