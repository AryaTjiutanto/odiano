import { ERROR_RESPONSE_CODE, InfiniteQuery, PostDTO, SEARCH_TYPES, SearchSuggestionDTO, UserSummaryDTO } from "@odiano/shared";
import { getHashtags } from "./hashtag.service.js";
import { AppError } from "../errors/appError.error.js";
import { listPostsByHashtag, searchPosts } from "./post.service.js";
import { searchUsers } from "./user.service.js";
import { searchOptions } from "../types/search.type.js";

export const getPostsSearchResult = async (query: string | undefined, cursor: string | undefined, currentUserId: string, options : searchOptions): Promise<InfiniteQuery<PostDTO[]>> => {
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
        posts = await listPostsByHashtag(currentUserId, query.substring(1), cursor, options);
    }

    posts = await searchPosts(currentUserId, query, cursor, options);

    return posts;
}

export const getUsersSearchResult = async (query: string | undefined): Promise<UserSummaryDTO[]> => {
    if (!query) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Search query is required");
    }

    const users = await searchUsers(query, 20);

    return users;
}

export const getSuggestions = async (query: string): Promise<SearchSuggestionDTO[]> => {
    const isTag = query.startsWith("#");

    // get tag suggestions
    if (isTag) {
        const hashtags = await getHashtags(query.substring(1));

        const formattedData = hashtags.map((hashtag): SearchSuggestionDTO => ({
            type: SEARCH_TYPES.HASHTAG,
            data: hashtag,
            keyword : null,
        }));

        return formattedData;
    }

    // get user suggestions
    const users = await searchUsers(query);

    const formattedData = users.map((user): SearchSuggestionDTO => ({
        type: SEARCH_TYPES.USER,
        data: user,
        keyword : null,
    }));

    return formattedData;
}