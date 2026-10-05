import { HashTagSummaryDTO } from "@odiano/shared"
import { HashTagSummaryQuery } from "../types/hashtag.type.js"

export const toHashTagSummaryDTO = (hashtag: HashTagSummaryQuery): HashTagSummaryDTO => {
    return {
        id: hashtag._id.toString(),
        name: hashtag.name,
        totalPost : hashtag.totalPost,
    }
}