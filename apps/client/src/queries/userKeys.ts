const mainKey = "user";

export const userKeys = {
    all : [mainKey],
    profile : (username? : string) => [mainKey, "profile", username],
    checkUsername : (username : string) => [mainKey, "check", username],
    isFollowing : (id : string) => [mainKey, 'is-following', id],
    
    userFollowing : (id : string) => [mainKey, id, "following"],
    userFollowers : (id : string) => [mainKey, id, "followers"], 

    sidebarSuggestions : [mainKey, "suggestions", "sidebar"],
    exploreSuggestions : [mainKey, "suggestions", "explore"],

    mutuals : (id : string | undefined | null) => {
        if(!id) return [mainKey, "mutuals"];
        
        return [mainKey, id, "mutuals"]
    }
}