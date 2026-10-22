import { Types } from "mongoose";
import { Post } from "../models/post.model.js"

export const getListPostsCursor = async (): Promise<{ cursor : Types.ObjectId }> => {
    // const latestPost = await Post.findOne().sort({ _id : -1 }).select("createdAt").lean();

    // if(!latestPost) {
    //     throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "No post found");
    // }

    // const latestDate = latestPost.createdAt;
    // const threeDaysAgo = new Date(latestDate.getTime() - 3 * 24 * 60 * 60 * 1000);

    const randomPost = await Post.aggregate([
        {
            $sample : {
                size : 1
            }
        },
        {
            $project : {
                _id : 1,
            }
        }
    ]);

    return {
        cursor : randomPost[0]._id,
    }
}