const mainKey = "user";

export const userKeys = {
    all : [mainKey],
    profile : (username? : string) => [mainKey, "profile", username],
    isFollowing : (id : string) => [mainKey, 'is-following', id],
}