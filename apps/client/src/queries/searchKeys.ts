const mainKey = "search";

export const searchKeys = {
    usersSearchResult : (query : string | undefined) => {
        const returnKey = [mainKey, "users"];

        if(query) returnKey.push(query);

        return returnKey;
    },
    postsSearchResult : (query :string | undefined) => {
        const returnKey = [mainKey, "posts"];

        if(query) returnKey.push(query);

        return returnKey;
    },
    postsMediaSearchResult : (query :string | undefined) => {
        const returnKey = [mainKey, "postsMedia"];

        if(query) returnKey.push(query);

        return returnKey;
    },
    hashtagsSearchResult : (query :string | undefined) => {
        const returnKey = [mainKey, "hashtags"];

        if(query) returnKey.push(query);

        return returnKey;
    },
    searchSuggestions : (query : string | undefined) => {
        const returnKey = [mainKey, "suggestions"];

        if(query) returnKey.push(query);

        return returnKey;
    },
    history : [mainKey, "history"]
}