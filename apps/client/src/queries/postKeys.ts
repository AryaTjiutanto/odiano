const mainKey = "post";

export const postKeys = {
    all: [mainKey],
    detail: (publicId: string) => [mainKey, publicId],
    
    userPosts : (username : string) => [mainKey, "user" , username],

    comment : (commentId : string) => [mainKey, "comment", commentId],
    comments: (postId: string, exclude?: string | undefined | null) => {
        if(exclude) {
            return [mainKey, postId, "comments", exclude];
        }

        return [mainKey, postId, "comments"];
    },
    currentUserComments: (postId: string) => [mainKey, postId, "comments", "me"],
};