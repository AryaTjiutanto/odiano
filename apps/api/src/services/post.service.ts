import { CreatedDocumentId, CreatePostSchema, ERROR_RESPONSE_CODE, InfiniteQuery, PostDTO, type PostDTO as PostFeedItem } from "@odiano/shared";
import { Post } from "../models/post.model";
import { toPostDto } from "../mappers/post.mapper";
import { PostQuery } from "../types/post.type";
import { POSTS_PAGE_SIZE } from "../consts/post.const";
import { AppError } from "../errors/appError.error";
import { User } from "../models/user.model";
import { LIKE_TYPES } from "../consts/like.const";
import { getIsLiked, getLikedIds } from "./like.service";
import mongoose from "mongoose";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { commitTempImage } from "../helpers/cloudinary.helper";
import { bulkCreateOrUpdateHashtag } from "./hashtag.service";

export const searchPosts = async (currentUserId: string, query: string, cursor: string | null | undefined): Promise<InfiniteQuery<PostFeedItem[]>> => {
    // get posts
    let posts = await Post.aggregate<PostQuery>([
        {
            $search: {
                index: "search_posts",
                compound: {
                    must: [
                        {
                            text: {
                                query: query,
                                path: ["content", "hashtags"],
                            }
                        }
                    ],

                    filter: [
                        {
                            compound: {
                                mustNot: [
                                    {
                                        equals: {
                                            path : "author",
                                            value: new mongoose.Types.ObjectId(currentUserId),
                                        }
                                    },
                                ]
                            }
                        },
                        ...(cursor ? [
                            {
                                range: {
                                    path : "_id",
                                    lt: new mongoose.Types.ObjectId(cursor),
                                }
                            }
                        ] : [])
                    ]
                }
            },
        },
        {
            $sort: {
                _id: -1,
            }
        },
        {
            $limit: POSTS_PAGE_SIZE + 1,
        },
        
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
                pipeline : [
                    {
                        $project : {
                            _id : 1,
                            name : 1,
                            username : 1,
                            profileImage : 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind : "$author"
        },
        {
            $project: {
                content: 1,
                publicId: 1,
                media: 1,
                visibility: 1,
                hideLikeAndViewCount: 1,
                turnOffCommenting: 1,
                isArchive: 1,
                createdAt: 1,
                updatedAt: 1,
                commentCount: 1,
                likeCount: 1,
                author: 1,
            },
        }
    ]);

    // check if there's a next page
    let hasNextPage = posts.length > POSTS_PAGE_SIZE;
    if (hasNextPage) {
        posts = posts.slice(0, POSTS_PAGE_SIZE);
    }

    // get likes
    let likedPostIds = new Set<String>();

    if (currentUserId) {
        const postIds = posts.map(post => post._id);

        const likedIds = await getLikedIds(currentUserId, LIKE_TYPES.POST, postIds);

        likedIds.forEach((id) => {
            likedPostIds.add(id);
        })
    }

    // organize the data
    const items = posts.map((post) =>
        toPostDto(post, {
            isLiked: currentUserId ? likedPostIds?.has(post._id.toString()) : false
        })
    );

    let nextCursor = items[items.length - 1]?.id

    return {
        nextCursor,
        hasNextPage,
        items,
    }
}

export const listPostsByHashtag = async (currentUserId: string | null | undefined, hashtag: string, cursor: string | undefined | null): Promise<InfiniteQuery<PostFeedItem[]>> => {
    // check is user authenticated
    if (cursor && !currentUserId) {
        throw new UnauthorizedError();
    }

    // get posts data
    const query = {
        hashtags: hashtag,
        ...(cursor ? {
            _id: mongoose.trusted({ $lt: cursor })
        } : {})
    };

    let posts = await Post.find(query)
        .sort({ _id: -1 })
        .select("content publicId media visibility hideLikeAndComment turnOffComment isArchive createdAt updatedAt commentCount likeCount")
        .populate("author", "name username profileImage")
        .limit(POSTS_PAGE_SIZE + 1).lean<PostQuery[]>();

    // check if there's a next page
    let hasNextPage = posts.length > POSTS_PAGE_SIZE;
    if (hasNextPage) {
        posts = posts.slice(0, POSTS_PAGE_SIZE);
    }

    // get likes
    let likedPostIds = new Set<String>();

    if (currentUserId) {
        const postIds = posts.map(post => post._id);

        const likedIds = await getLikedIds(currentUserId, LIKE_TYPES.POST, postIds);

        likedIds.forEach((id) => {
            likedPostIds.add(id);
        })
    }

    // organize the data
    const items = posts.map((post) =>
        toPostDto(post, {
            isLiked: currentUserId ? likedPostIds?.has(post._id.toString()) : false
        })
    );

    let nextCursor = items[items.length - 1]?.id

    return {
        nextCursor,
        hasNextPage,
        items,
    }
}

export const listPosts = async (currentUserId: string | null | undefined, cursor: string | null): Promise<InfiniteQuery<PostFeedItem[]>> => {
    // check is user authenticated
    if (cursor && !currentUserId) {
        throw new UnauthorizedError();
    }

    // get posts data
    const query = cursor ? {
        _id: mongoose.trusted({ $lt: cursor })
    } : {};

    let posts = await Post.find(query)
        .sort({ _id: -1 })
        .select("content publicId media visibility hideLikeAndComment turnOffComment isArchive createdAt updatedAt commentCount likeCount")
        .populate("author", "name username profileImage")
        .limit(POSTS_PAGE_SIZE + 1).lean<PostQuery[]>();

    // check if there's a next page
    let hasNextPage = posts.length > POSTS_PAGE_SIZE;
    if (hasNextPage) {
        posts = posts.slice(0, POSTS_PAGE_SIZE);
    }

    // get likes
    let likedPostIds = new Set<String>();

    if (currentUserId) {
        const postIds = posts.map(post => post._id);

        const likedIds = await getLikedIds(currentUserId, LIKE_TYPES.POST, postIds);

        likedIds.forEach((id) => {
            likedPostIds.add(id);
        })
    }

    // organize the data
    const items = posts.map((post) =>
        toPostDto(post, {
            isLiked: currentUserId ? likedPostIds?.has(post._id.toString()) : false
        })
    );

    let nextCursor = items[items.length - 1]?.id

    return {
        nextCursor,
        hasNextPage,
        items,
    }
}

export const getPost = async (currentUserId: string | null | undefined, publicId: string): Promise<PostDTO | null> => {
    const post = await Post.findOne({ publicId })
        .select("content publicId media visibility hideLikeAndComment turnOffComment isArchive createdAt updatedAt commentCount likeCount")
        .populate("author", "name username profileImage")
        .lean<PostQuery>();

    if (!post) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "This post is not available");
    }

    // check is liked
    let isLiked: boolean = false;

    if (currentUserId) {
        isLiked = await getIsLiked(currentUserId, LIKE_TYPES.POST, post._id);
    }

    return toPostDto(post, { isLiked });
}

export const create = async (
    userId: string,
    data: CreatePostSchema
): Promise<CreatedDocumentId> => {
    const session = await mongoose.startSession();

    try {
        const result = await session.withTransaction(async () => {
            // create hashtag
            let hashtags: string[] | null = null;
            if (data.hashtags) {
                hashtags = await bulkCreateOrUpdateHashtag(data.hashtags, session);
            }

            // Create post
            const [post] = await Post.create(
                [
                    {
                        author: userId,
                        content: data.content,
                        visibility: data.visibility,
                        hideLikeAndViewCount: data.hideLikeAndViewCount,
                        turnOffCommenting: data.turnOffCommenting,
                        isArchive: data.isArchive,
                        hashtags: hashtags,
                    },
                ],
                { session }
            );

            // update user total posts
            await User.updateOne({
                _id : userId
            }, {
                $inc : {
                    totalPosts : 1
                }
            }, { session });

            // Commit temporary media
            if (data.media?.length) {
                const committedPostMedia = await Promise.all(
                    data.media.map(async (media) => {
                        const committedData = await commitTempImage(
                            media.source.publicId
                        );

                        if (!committedData) {
                            throw new Error(
                                `Failed to commit media: ${media.source.publicId}`
                            );
                        }

                        return {
                            ...media,
                            source: committedData,
                        };
                    })
                );

                await Post.updateOne(
                    { _id: post._id },
                    {
                        $set: {
                            media: committedPostMedia,
                        },
                    },
                    { session }
                );
            }

            return {
                id : post._id.toString(),
                publicId: post.publicId,
            };
        });

        if (!result) {
            throw new Error("Failed to create post");
        }

        return result;
    } finally {
        await session.endSession();
    }
};

export const getUserPosts = async (currentUserId: string | null | undefined, username: string, cursor: string | null): Promise<InfiniteQuery<PostDTO[]>> => {
    // check is user authenticated
    if (cursor && !currentUserId) {
        throw new UnauthorizedError();
    }

    // get user
    const user = await User.findOne({ username })
        .select('_id')
        .lean();

    if (!user) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "User not found");
    }

    const query = {
        author: user._id,
        ...(cursor ?
            {
                _id: mongoose.trusted({
                    $lt: cursor
                })
            }
            :
            {}
        )
    }

    // get posts
    let posts = await Post.find(query)
        .sort({ _id: -1 })
        .select("_id publicId content media visibility hideLikeAndViewCount turnOffCommenting isArchive createdAt updatedAt commentCount likeCount")
        .limit(POSTS_PAGE_SIZE + 1)
        .lean<PostQuery[]>();

    let nextCursor = null;
    let items: PostDTO[] = [];

    // handle hasNextPage
    let hasNextPage = posts.length > POSTS_PAGE_SIZE;
    if (hasNextPage) {
        posts = posts.slice(0, POSTS_PAGE_SIZE);
    }

    if (posts.length > 0) {
        // handle like
        let likedPostIds = new Set<string>();

        if (currentUserId) {
            const postIds = posts.map(post => post._id);
            const likedIds = await getLikedIds(currentUserId, LIKE_TYPES.POST, postIds);

            likedIds.forEach((id) => likedPostIds.add(id));
        }

        // formatting the data
        items = posts.map((post) => toPostDto(post, {
            isLiked: currentUserId ? likedPostIds.has(post._id.toString()) : false,
        }));

        // cursor
        nextCursor = items[items.length - 1].id;
    }

    return {
        hasNextPage,
        nextCursor,
        items,
    };
}

export const deletePost = async (currentUserId: string, postId: string | undefined | null) => {
    if (!postId) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
    }

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const post = await Post.findOne({
                _id: postId,
            })
                .session(session)
                .select("_id author");

            if (!post) {
                throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "Post Not found")
            }

            if (post.author.toString() != currentUserId) {
                throw new AppError(403, ERROR_RESPONSE_CODE.forbidden, "You dont have permission to delete this post");
            }

            await post.deleteOne({ session });

            // decrese user total posts
            await User.updateOne({
                _id : currentUserId
            }, {
                $inc : {
                    totalPosts : -1
                }
            }, {session});
        });
    } finally {
        await session.endSession();
    }

}