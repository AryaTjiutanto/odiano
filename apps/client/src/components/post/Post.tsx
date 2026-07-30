import { ERROR_RESPONSE_CODE, type PostDTO, type UserSummaryDTO } from "@odiano/shared";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../profile/Profile";
import { useMutation } from "@tanstack/react-query";
import { postKeys } from "../../queries/postKeys";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { useEffect, type MouseEvent } from "react";
import { applyLikeToInfinitePostCache, removeLikeFromInfinitePostCache } from "../../helpers/cache/postCache.helper";
import type { InfiniteQueryPostDTO } from "../../types/post.type";
import { createLike, deleteLike } from "../../services/post.service";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import { useAppSelector } from "../../hooks/useRedux";
import PostMenu from "../floating-menu/PostMenu";

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
    const postQueryKey = postKeys.all;

    // like post mutation
    const applylikeMutation = useMutation({
        mutationFn: createLike,
        mutationKey: postQueryKey,

        onMutate: () => setQueryDataHandler<InfiniteQueryPostDTO>(postQueryKey, (old) => applyLikeToInfinitePostCache(old, data.id)),

        onError: () => setQueryDataHandler<InfiniteQueryPostDTO>(postQueryKey, (old) => removeLikeFromInfinitePostCache(old, data.id)),
    })

    // unlike postMutation
    const removeLikeMutation = useMutation({
        mutationFn: deleteLike,
        mutationKey: postQueryKey,

        onMutate: () => setQueryDataHandler<InfiniteQueryPostDTO>(postQueryKey, (old) => removeLikeFromInfinitePostCache(old, data.id)),
        onError: () => setQueryDataHandler<InfiniteQueryPostDTO>(postQueryKey, (old) => applyLikeToInfinitePostCache(old, data.id)),
    })

    // handle like
    const handleLike = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (!isInitialized) return;

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
                        <div>
                            <div className="flex items-center space-x-2 text-xs">
                                <h1 className="text-neutral-100 font-semibold">{dataAuthor?.name ?? ""}</h1>
                                <h2 className="text-neutral-500">@{dataAuthor?.username ?? ""}</h2>
                            </div>
                            <h3 className="text-[11px] text-neutral-500">
                                {data.createdAt ? formatDistanceToNow(data.createdAt) : '-'}
                            </h3>
                        </div>
                    </div>
                </Link>

                <div onClick={(e) => e.stopPropagation()}>
                    <PostMenu authorUsername={author?.username} post={data} canDeletePost={canDeletePost} />
                </div>
            </div>
            <p className="text-sm mt-8 whitespace-pre-wrap">
                {data.content ?? ""}
            </p>
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