import { SEARCH_TYPES, SearchSuggestionDTO } from "@odiano/shared";
import { searchUsers } from "./user.service"
import { getHashtags } from "./hashtag.service";

export const getSuggestions = async (query: string): Promise<SearchSuggestionDTO[]> => {
    const isTag = query.startsWith("#");

    // get tag suggestions
    if (isTag) {
        const hashtags = await getHashtags(query.substring(1));

        const formattedData = hashtags.map((hashtag) : SearchSuggestionDTO => ({
            type: SEARCH_TYPES.HASHTAG,
            data: hashtag,
        }));

        return formattedData;
    }

    // get user suggestions
    const users = await searchUsers(query);

    const formattedData = users.map((user) : SearchSuggestionDTO => ({
        type: SEARCH_TYPES.USER,
        data: user,
    }));

    return formattedData;
}