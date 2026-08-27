import mongoose, { ClientSession } from "mongoose";
import HashTag from "../models/hashtag.model"
import { HashTagSummaryDTO } from "@odiano/shared";
import { HashTagSummaryQuery } from "../types/hashtag.type";
import { toHashTagSummaryDTO } from "../mappers/hashtag.mapper";

const hashTagRegex = /^[\p{L}\p{N}_]+$/u;

export const bulkCreateOrUpdateHashtag = async (hashtag: string[], session: ClientSession): Promise<string[]> => {
    const formattedHashtag = hashtag
        .filter((tag) => hashTagRegex.test(tag))
        .map((tag) => tag.toLowerCase().trim());

    await HashTag.bulkWrite(
        formattedHashtag.map((tag) => {
            return {
                updateOne: {
                    filter: { name: tag },
                    update: {
                        $setOnInsert: { name: tag },
                        $inc: { totalPost: 1 }
                    },
                    upsert: true,
                },
            }
        }),
        { session }
    )

    return formattedHashtag;
}

export const bulkDecreseHashtagsCount = async (hashtags: string[], session: ClientSession) => {
    await HashTag.updateMany(
        { name: mongoose.trusted({ $in: hashtags }) },
        { $inc: { totalPost: -1 } },
        { session }
    );
}

export const getHashtags = async (name : string): Promise<HashTagSummaryDTO[]> => {
    const hashtags = await HashTag.find({
        name : mongoose.trusted({
            $regex : name,
            $options : "i"
        })
    })
    .sort({ totalPost : -1 })
    .select("_id name totalPost")
    .limit(5)
    .lean<HashTagSummaryQuery[]>();

    const formattedHashtags = hashtags.map((hashtag) => toHashTagSummaryDTO(hashtag));

    return formattedHashtags;
}