import { PostDTO } from "@connect/shared";
import { type PostQuery } from "../types/post.type";

export const toPostDto = (posts: PostQuery[]): PostDTO[] => {
    return posts.map((post) => {
        return {
            content: post.content,
            hideLikeAndViewCount: post.hideLikeAndViewCount,
            isArchive: post.isArchive,
            media: post.media,
            id: post._id.toString(),
            publicId: post.publicId,
            turnOffCommenting: post.turnOffCommenting,
            visibility: post.visibility,
            createdAt: post.createdAt,
            ...(
                post.author?._id && {
                    author: {
                        id: post.author._id.toString(),
                        name: post.author.name,
                        username: post.author.username,
                        profileImage: post.author.profileImage,
                        slug: post.author.slug
                    }
                }
            )
        }
    })
}