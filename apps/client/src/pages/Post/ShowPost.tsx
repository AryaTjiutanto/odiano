import { Heart, MessageCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { type SuccessResponseData, type PostDTO } from "@connect/shared";
import { api } from "../../libs/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import PostDetailSkeletonLoading from "../../components/post/PostDetailSkeletonLoading";
import ErrorState from "../../components/common/ErrorState";
import GoBackIconButton from "../../components/common/GoBackIconButton";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import DotsLoader from "../../components/loader/DotsLoader";
import { createFollowing, deleteFollowing } from "../../services/following.service";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import type { AxiosErrorResponseData } from "../../types/response.type";
import { notify } from "../../helpers/notification/notify.helper";
import CommentSection from "../../components/post/comment/CommentSection";
import Profile from "../../components/profile/Profile";
import { useAppSelector } from "../../hooks/useRedux";
import { postKeys } from "../../queries/postKeys";
import NotFound from "../Error/NotFound";
import { userKeys } from "../../queries/userKeys";
import { applyLikeToInfinitePostCache, applyLikeToPostCache, removeLikeFromInfinitePostCache, removeLikeFromPostCache } from "../../helpers/cache/postCache.helper";
import { createLike, deleteLike } from "../../services/post.service";
import type { InfiniteQueryPostDTO } from "../../types/post.type";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";

type IsFollowingQueryData = {
    isFollowing: boolean
}

const ShowPost = () => {
    const navigate = useNavigate();

    const { username, postPublicId } = useParams();
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const currentUserId = useAppSelector((state) => state.auth.user?.id);

    const setQueryDataHandler = useSetQueryDataHandler();


    // get post data
    const postQueryKey = postKeys.detail(postPublicId!);

    const getPost = async () => {
        const response = await api.get<SuccessResponseData<PostDTO>>(`/post/${postPublicId}`);

        if (!response.data.data) {
            throw new Error("Data is missing");
        }

        return response.data.data;
    }

    const postQuery = useQuery({
        queryKey: postQueryKey,
        queryFn: getPost,
        enabled: !!postPublicId,
        staleTime: 10 * 1000,
        initialData : null,
        gcTime: DEFAULT_GC_TIME,
    })

    useEffect(() => {
        if (!postPublicId) {
            navigate("/");
        }
    }, [postPublicId, navigate])

    // get is following handler
    const isFollowingQueryKey = userKeys.isFollowing(postQuery.data?.author?.id || "");

    const getIsFollowingInformation = async () => {
        const response = await api.get<SuccessResponseData<IsFollowingQueryData>>(`/following/check/${postQuery.data?.author?.id}`);

        return response.data.data;
    }

    const isFollowingQuery = useQuery({
        queryFn: getIsFollowingInformation,
        queryKey: isFollowingQueryKey,
        enabled: (!!postQuery?.data && isAuthenticated),
        initialData : null,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
    });

    // handle follow mutation
    const followMutation = useMutation({
        mutationFn: createFollowing,

        onMutate: () => setQueryDataHandler<IsFollowingQueryData>(isFollowingQueryKey, () => {
            return {
                isFollowing: true,
            }
        }),
        onError: () => setQueryDataHandler<IsFollowingQueryData>(isFollowingQueryKey, () => {
            return {
                isFollowing: false,
            }
        }),
    })

    const handleFollow = async () => {
        if (!isAuthenticated) {
            return navigate("/signin");
        }

        try {
            await followMutation.mutateAsync(postQuery.data?.author?.id);
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Follow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    // handle unfollow mutation
    const unfollowMutation = useMutation({
        mutationFn: deleteFollowing,

        onMutate: () => setQueryDataHandler<IsFollowingQueryData>(isFollowingQueryKey, () => ({
            isFollowing: false,
        })),

        onError: () => setQueryDataHandler<IsFollowingQueryData>(isFollowingQueryKey, () => ({
            isFollowing: true,
        }))
    })

    const handleUnfollow = async () => {
        if (!isAuthenticated) {
            return navigate("/signin");
        }

        try {
            await unfollowMutation.mutateAsync(postQuery.data?.author?.id);
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Unfollow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    // like mutation
    const likeMutation = useMutation({
        mutationFn: createLike,

        onMutate: (postId: string) => {
            setQueryDataHandler<PostDTO>(postQueryKey, (oldData) => applyLikeToPostCache(oldData))

            setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.all, (oldData) => applyLikeToInfinitePostCache(oldData, postId))
        },
        onError: (postId: string) => {
            setQueryDataHandler<PostDTO>(postQueryKey, (oldData) => removeLikeFromPostCache(oldData))

            setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.all, (oldData) => removeLikeFromInfinitePostCache(oldData, postId))
        },
    })

    // delete like mutation
    const unlikeMutation = useMutation({
        mutationFn: deleteLike,

        onMutate: (postId: string) => {
            setQueryDataHandler<PostDTO>(postQueryKey, (oldData) => removeLikeFromPostCache(oldData))

            setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.all, (oldData) => removeLikeFromInfinitePostCache(oldData, postId))
        },
        onError: (postId: string) => {
            setQueryDataHandler<PostDTO>(postQueryKey, (oldData) => applyLikeToPostCache(oldData))

            setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.all, (oldData) => applyLikeToInfinitePostCache(oldData, postId))
        },
    })

    // handle like 
    const handleLike = async () => {
        if (!postQuery.data) return;

        if(!isInitialized) return;

        if(!isAuthenticated) {
            return navigate("/signin")
        }

        try {
            if (postQuery.data?.isLiked) {
                await unlikeMutation.mutateAsync(postQuery.data?.id);
            } else {
                await likeMutation.mutateAsync(postQuery.data?.id);
            }
        } catch (err: unknown) {
            handleApiErrorNotification(err);
        }
    }

    
    // display
    if (postQuery.isPending) {
        return <PostDetailSkeletonLoading />
    }

    // check postPublicId
    if (!postPublicId || !postQuery.data) {
        return <NotFound />
    }

    if (postQuery.isError) {
        return (
            <div className="w-full h-full grid place-content-center">
                <ErrorState
                    title="This post isn't available"
                    description="The post may have been deleted or the link is no longer valid."
                    fontSize="small"
                />
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-full relative main-section-padding-top">
                <div>
                    <div className="flex items-center space-x-5">
                        <GoBackIconButton />
                        <h1 className="text-xl font-bold">
                            Post
                        </h1>
                    </div>
                </div>

                {/* post detail */}
                <div className="w-full">
                    {/* profile */}
                    <div className="w-full flex items-center justify-between mt-8">
                        <Link to={`/profile/${username}`}>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 aspect-square">
                                    <Profile data={postQuery?.data.author?.profileImage} />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 text-base">
                                        <h1 className="text-neutral-100 font-semibold">{postQuery.data?.author?.name ?? ""}</h1>
                                    </div>
                                    <div className="text-sm text-neutral-500">
                                        <h2 className="text-neutral-500">@{postQuery.data?.author?.username ?? ""}</h2>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="flex items-center space-x-3">
                            {
                                currentUserId !== postQuery.data.author?.id &&
                                <>
                                    {
                                        (isFollowingQuery.isPending && isAuthenticated) ?
                                            <div className="w-20 h-10 rounded-lg bg-neutral-100 grid place-content-center text-neutral-900">
                                                <DotsLoader />
                                            </div>
                                            :
                                            <>
                                                <div className={`max-w-28 h-10 duration-100 rounded-lg border text-sm ${isFollowingQuery.data?.isFollowing ? "border-neutral-100 hover:bg-transparent hover:border-rose-500 hover:text-rose-500" : "border-neutral-100 hover:bg-neutral-100 hover:text-neutral-700"}`}>
                                                    {
                                                        isFollowingQuery.data?.isFollowing ?
                                                            <button className="w-28 h-full cursor-pointer" onClick={handleUnfollow}>
                                                                Unfollow
                                                            </button>
                                                            :
                                                            <button className="w-20 h-full cursor-pointer" onClick={handleFollow}>
                                                                Follow
                                                            </button>
                                                    }
                                                </div>
                                            </>
                                    }
                                </>
                            }

                            {/* comming soon */}
                            {/* <EllipsisVertical className="w-4 duration-100 cursor-pointer" /> */}
                        </div>
                    </div>
                    {/* content */}
                    <div className="mt-6 whitespace-pre-wrap">
                        {
                            postQuery.data?.content ?? ""
                        }
                    </div>

                    {/* Post information */}
                    <div className="flex items-center space-x-3 text-neutral-500 mt-4">
                        <div>
                            7:56 PM
                        </div>
                        <div className="w-1 aspect-square rounded-full bg-neutral-700"></div>
                        <div>
                            May 29, 2026
                        </div>

                        {/* <div className="w-1 aspect-square rounded-full bg-neutral-700"></div>
                <div>
                    <b className="text-neutral-300">40</b> Views
                </div> */}
                    </div>

                    <div className="flex items-center justify-between mt-10">
                        <div className="flex items-center space-x-10">
                            <button className={`flex items-center space-x-2 cursor-pointer ${postQuery.data.isLiked && "text-rose-500"}`} onClick={handleLike}>
                                <Heart className={`${postQuery.data.isLiked && "fill-rose-500"}`} />
                                <p>
                                    {postQuery.data?.likeCount ?? 0}
                                </p>
                            </button>
                            <div className="flex items-center space-x-2">
                                <MessageCircle />
                                <p>
                                    {postQuery.data?.commentCount ?? 0}
                                </p>
                            </div>

                            {/* comming soon */}
                            {/* <button className="cursor-pointer">
                                <Send />
                            </button> */}
                        </div>

                        {/* comming soon */}
                        {/* <button className="cursor-pointer">
                            <Bookmark />
                        </button> */}
                    </div>
                </div>

                {/* comment */}
                <CommentSection postId={postQuery.data.id} />
            </div>
        </>
    )
}

export default ShowPost;