import { ClientSession } from "mongoose";
import HashTag from "../models/hashtag.model"

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