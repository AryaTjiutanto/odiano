const mainKey = "user";

export const userKeys = {
    all : [mainKey],
    isFollowing : (id : string) => [mainKey, 'is-following', id],
}