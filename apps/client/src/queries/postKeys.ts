const mainKey = "post";

export const postKeys = {
    all: [mainKey],
    detail: (publicId: string) => [mainKey, publicId],
    
    userPosts : (username : string) => [mainKey, "user" , username],

    comments: (postId: string) => [mainKey, postId, "comments"],
    currentUserComments: (postId: string) => [mainKey, postId, "comments", "me"],
};