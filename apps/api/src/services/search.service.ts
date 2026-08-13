import { ERROR_RESPONSE_CODE, InfiniteQuery, PostDTO, SEARCH_TYPES, SearchSuggestionDTO } from "@odiano/shared";
import { searchUsers } from "./user.service"
import { getHashtags } from "./hashtag.service";
import { AppError } from "../errors/appError.error";
import { listPostsByHashtag } from "./post.service";

export const getSearchResult = async (query: string | undefined, cursor: string | undefined, currentUserId: string | null | undefined): Promise<InfiniteQuery<PostDTO[]>> => {
    if (!query) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Search query is required");
    }

    let posts: InfiniteQuery<PostDTO[]> = {
        hasNextPage: false,
        items: [],
        nextCursor: null,
    };
    const isTag = query.startsWith("#");

    // get post by tag
    if (isTag) {
        posts = await listPostsByHashtag(currentUserId, query.substring(1), cursor);
    }

    return posts;
}

export const getSuggestions = async (query: string): Promise<SearchSuggestionDTO[]> => {
    const isTag = query.startsWith("#");

    // get tag suggestions
    if (isTag) {
        const hashtags = await getHashtags(query.substring(1));

        const formattedData = hashtags.map((hashtag): SearchSuggestionDTO => ({
            type: SEARCH_TYPES.HASHTAG,
            data: hashtag,
        }));

        return formattedData;
    }

    // get user suggestions
    const users = await searchUsers(query);

    const formattedData = users.map((user): SearchSuggestionDTO => ({
        type: SEARCH_TYPES.USER,
        data: user,
    }));

    return formattedData;
}