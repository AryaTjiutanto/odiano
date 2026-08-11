import { model, Schema } from "mongoose"

type HashTagSchema = {
    name: string,
    totalPost: number,
}

const hashtagSchema = new Schema<HashTagSchema>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    totalPost: {
        type: Number,
        default: 0,
    }  
}, {timestamps: true})

const HashTag = model<HashTagSchema>("HashTag", hashtagSchema);

export default HashTag;