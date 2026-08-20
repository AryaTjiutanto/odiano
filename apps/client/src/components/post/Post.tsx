import { ERROR_RESPONSE_CODE, type PostDTO, type UserSummaryDTO } from "@odiano/shared";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../profile/Profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "../../queries/postKeys";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { type MouseEvent } from "react";
import { applyLikeToInfinitePostCache, applyLikeToPostCache, removeLikeFromInfinitePostCache, removeLikeFromPostCache } from "../../helpers/cache/postCache.helper";
import type { InfiniteQueryPostDTO } from "../../types/post.type";
import { createLike, deleteLike } from "../../services/post.service";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import { useAppSelector } from "../../hooks/useRedux";
import PostMenu from "../floating-menu/PostMenu";
import PostMedia from "./PostMedia";
import PostContent from "./PostContent";

type Props = {
    data: PostDTO,
    author?: UserSummaryDTO,
    canDeletePost?: boolean,
}

const Post = ({ data, author, canDeletePost = false }: Props) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);

    const navigate = useNavigate();
    const setQueryDataHandler = useSetQueryDataHandler();

    const dataAuthor = data.author ?? author;

    // mutation handler
    function likeMutationHandler() {
        setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.all, (old) => applyLikeToInfinitePostCache(old, data.id))

        // set post data
        setQueryDataHandler<PostDTO>(postKeys.detail(data.publicId), (old) => applyLikeToPostCache(old));
        
        // set user posts
        if (!dataAuthor?.username) return;
        setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(dataAuthor?.username), (old) => applyLikeToInfinitePostCache(old, data.id))
    }

    function unlikeMutationHandler() {
        setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.all, (old) => removeLikeFromInfinitePostCache(old, data.id))

        // set post data
        setQueryDataHandler<PostDTO>(postKeys.detail(data.publicId), (old) => removeLikeFromPostCache(old));

        // set user posts
        if (!dataAuthor?.username) return;
        setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(dataAuthor?.username), (old) => removeLikeFromInfinitePostCache(old, data.id));
    }

    // like post mutation
    const applylikeMutation = useMutation({
        mutationFn: createLike,
        onMutate: likeMutationHandler,
        onError: unlikeMutationHandler,
    })

    // unlike postMutation
    const removeLikeMutation = useMutation({
        mutationFn: deleteLike,
        onMutate: unlikeMutationHandler,
        onError: likeMutationHandler,
    })

    // handle like
    const handleLike = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (!isInitialized || removeLikeMutation.isPending || applylikeMutation.isPending) return;

        if (!isAuthenticated) {
            return navigate("/signin");
        }

        try {
            if (data.isLiked) {
                await removeLikeMutation.mutateAsync(data.id);
            } else {
                await applylikeMutation.mutateAsync(data.id);
            }
        } catch (err: unknown) {
            handleApiErrorNotification(err, {
                notifications: {
                    [ERROR_RESPONSE_CODE.conflict]: {
                        title: "Action not allowed",
                    }
                }
            });
        }
    }

    return (
        <article onClick={() => navigate(`/${dataAuthor?.username}/post/${data.publicId}`)} className="inline-block w-full pb-6 sm:pb-7 sm:p-7 sm:rounded-lg sm:bg-neutral-950 cursor-pointer border-b last:border-0 border-neutral-900 sm:border-0">
            <div className="flex items-center justify-between">
                <Link to={`/profile/${dataAuthor?.username}`} className="z-20">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 aspect-square">
                            <Profile data={dataAuthor?.profileImage} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                                <h1 className="text-neutral-100 font-semibold">{dataAuthor?.name ?? ""}</h1>
                                <h2 className="text-neutral-500">@{dataAuthor?.username ?? ""}</h2>
                            </div>
                            <h3 className="text-xs text-neutral-500">
                                {data.createdAt ? formatDistanceToNow(data.createdAt) : '-'}
                            </h3>
                        </div>
                    </div>
                </Link>

                <div onClick={(e) => e.stopPropagation()}>
                    <PostMenu authorUsername={author?.username} post={data} canDeletePost={canDeletePost} />
                </div>
            </div>
            <div className="w-full mt-8 space-y-5">
                <PostMedia media={data.media} />
                <PostContent content={data.content} />
            </div>
            <div className="mt-8 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 z-20 hover:text-sky-500 duration-100" onClick={(e) => e.preventDefault()}>
                        <MessageCircle className="w-4" />
                        <span>
                            {data.commentCount ?? 0}
                        </span>
                    </div>
                    <button className={`flex items-center space-x-1 z-20 ${data.isLiked ? 'text-rose-500' : 'hover:text-rose-500'} duration-100 cursor-pointer`} onClick={handleLike}>
                        <Heart className={`w-4 ${data.isLiked && 'fill-rose-500'}`} />
                        <span>
                            {data.likeCount ?? 0}
                        </span>
                    </button>
                </div>

                {/* comming soon */}
                {/* <button>
                    <Bookmark className="w-4 cursor-pointer hover:text-sky-500 duration-100" onClick={(e) => e.preventDefault()} />
                </button> */}
            </div>
        </article>
    )
}

export default Post;