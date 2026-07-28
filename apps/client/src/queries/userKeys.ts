const mainKey = "user";

export const userKeys = {
    all : [mainKey],
    profile : (username? : string) => [mainKey, "profile", username],
    checkUsername : (username : string) => [mainKey, "check", username],
    isFollowing : (id : string) => [mainKey, 'is-following', id],
    suggestions : [mainKey, "suggestions"],
}