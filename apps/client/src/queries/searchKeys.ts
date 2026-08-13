const mainKey = "search";

export const searchKeys = {
    search : (query :string | undefined) => {
        const returnKey = [mainKey];

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