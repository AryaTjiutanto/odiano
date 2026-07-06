const mainKey = "search";

export const searchKeys = {
    search : (value : string | undefined) => {
        const returnKey = [mainKey];

        if(value) returnKey.push(value);

        return returnKey;
    } 
}