import { useParams } from "react-router-dom";
import GoBackIconButton from "../../components/common/GoBackIconButton";
import { CalendarDays, EllipsisVertical } from "lucide-react";
import ProfileComponent from "../../components/social/Profile";
import { useInfiniteQuery, useMutation, useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { ERROR_RESPONSE_CODE, type ErrorResponseData, type InfiniteQuery, type PostDTO, type SuccessResponseData, type UserProfileDTO } from "@connect/shared";
import ErrorState from "../../components/common/ErrorState";
import PostSkeletonLoading from "../../components/post/PostSkeletonLoading";
import Post from "../../components/post/Post";
import type { AxiosError } from "axios";
import InfiniteScrollSentinel from "../../components/common/InfiniteScrollSentinel";
import { useAppSelector } from "../../shared/hooks/useRedux";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { createFollowing, deleteFollowing } from "../../helpers/following.helper";
import { notify } from "../../helpers/notify.helper";
import type { AxiosErrorResponseData } from "../../types/response";

const Profile = () => {
    const currentUserId = useAppSelector((state) => state.auth.user?.id);
    const setQueryDataHandler = useSetQueryDataHandler();

    const { username } = useParams();
    const profileQueryKey = ['user', username];

    // get user data
    async function getUserProfile() {
        const response = await api.get<SuccessResponseData<UserProfileDTO>>(`users/${username}`);

        if (!response.data.data) {
            throw new Error("User not found");
        }

        return response.data.data;
    }

    const profileQuery = useQuery({
        queryFn: getUserProfile,
        enabled: !!username,
        queryKey: profileQueryKey,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
    })

    // get user posts
    const getUserPosts = async ({ pageParam }: QueryFunctionContext): Promise<InfiniteQuery<PostDTO[]>> => {
        const response = await api<SuccessResponseData<InfiniteQuery<PostDTO[]>>>(`/post/user/${username}`, {
            params: {
                cursor: pageParam,
            }
        });

        if (!response.data.data) {
            throw new Error("Data is empty");
        }

        return response.data.data;
    }

    const postsQuery = useInfiniteQuery({
        queryFn: getUserPosts,
        queryKey: ['post', username],
        enabled: !!profileQuery.data,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<PostDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        }
    });

    // create following handler
    const followMutation = useMutation({
        mutationFn: createFollowing,

        onMutate: () => setQueryDataHandler<UserProfileDTO>(profileQueryKey, (oldData) => {
            return {
                ...oldData,
                followerCount: oldData.followerCount + 1,
                isFollowing: true,
            }
        }),

        onError: () => setQueryDataHandler<UserProfileDTO>(profileQueryKey, (oldData) => {
            return {
                ...oldData,
                followerCount: oldData.followerCount - 1,
                isFollowing: false,
            }
        })
    })

    const handleFollow = async () => {
        try {
            await followMutation.mutateAsync(profileQuery.data?.id);
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({"title" : "Follow failed", "description" : error.response?.data.message || "Something went wrong"});
        }
    }

    // delete following handler
    const unfollowMutation = useMutation({
        mutationFn: deleteFollowing,

        onMutate: () => setQueryDataHandler<UserProfileDTO>(profileQueryKey, (oldData) => ({
            ...oldData,
            followerCount: oldData.followerCount - 1,
            isFollowing: false,
        })),

        onError: () => setQueryDataHandler<UserProfileDTO>(profileQueryKey, (oldData) => ({
            ...oldData,
            followerCount: oldData.followerCount + 1,
            isFollowing: true,
        }))
    })

    const handleUnfollow = async () => {
        try {
            await unfollowMutation.mutateAsync(profileQuery.data?.id);
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({"title" : "Unfollow failed", "description" : error.response?.data.message || "Something went wrong"});
        }
    }

    // handler
    if (profileQuery.isPending) {
        return (

            <div className="w-full min-h-screen bg-neutral-950 text-neutral-200">
                {/* head */}
                <div className="w-full flex items-center space-x-2">
                    <GoBackIconButton />
                    <div className="space-y-1">
                        <div className="w-32 h-4 bg-neutral-700 animate-pulse rounded"></div>
                        <div className="w-20 h-4 bg-neutral-700 animate-pulse rounded"></div>
                    </div>
                </div>

                {/* banner and profile picture */}
                <div className="w-full banner-aspect bg-neutral-700 rounded-xl mt-5 relative animate-pulse">
                    {/* profile */}
                    <div className={`absolute rounded-full w-28 aspect-square left-6 -bottom-[25%] bg-neutral-700`}></div>
                </div>

                {/* action button */}
                <div className="w-full mt-8 flex justify-end space-x-3">
                    <div className="w-32 h-11 bg-neutral-700 animate-pulse rounded"></div>
                    <div className="w-11 h-11 bg-neutral-700 animate-pulse rounded"></div>
                </div>

                {/* user information */}
                <div className="mt-5">
                    <div className="space-y-1">
                        <div className="w-20 h-4 bg-neutral-700 animate-pulse rounded"></div>
                        <div className="w-12 h-4 bg-neutral-700 animate-pulse rounded"></div>
                    </div>

                    <div className="mt-5 space-y-1">
                        <div className="w-full h-4 bg-neutral-700 animate-pulse rounded"></div>
                        <div className="w-[50%] h-4 bg-neutral-700 animate-pulse rounded"></div>
                    </div>
                </div>

                {/* join information */}
                <button className="flex items-center space-x-3 mt-5">
                    <div className="flex items-center text-neutral-400 space-x-1">
                        <div className="w-4 h-3 bg-neutral-700 animate-pulse rounded"></div>
                        <div className="w-20 h-3 bg-neutral-700 animate-pulse rounded"></div>
                    </div>
                </button>

                {/* follow infomation */}
                <div className="flex items-center space-x-3 mt-5">
                    <div className="flex items-center space-x-1 text-sm`">
                        <div className="w-4 h-3 bg-neutral-700 animate-pulse rounded"></div>
                        <div className="w-16 h-3 bg-neutral-700 animate-pulse rounded"></div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm`">
                        <div className="w-4 h-3 bg-neutral-700 animate-pulse rounded"></div>
                        <div className="w-16 h-3 bg-neutral-700 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (profileQuery.isError) {
        const error = profileQuery.error as AxiosError<ErrorResponseData>;
        const response = error.response;

        if (response?.data.code == ERROR_RESPONSE_CODE.notFound) {
            return (
                <div className="w-full h-full grid place-content-center">
                    <ErrorState
                        title="This User isn't available"
                        description="User may have been deleted or change the username."
                        fontSize="small"
                    />
                </div>
            )
        }
    }

    return (
        <div className="w-full min-h-screen bg-neutral-950 text-neutral-200">
            {/* head */}
            <div className="w-full flex items-center space-x-2">
                <GoBackIconButton />
                <div>
                    <h1 className="font-bold text-white">
                        {profileQuery.data && profileQuery.data.name || ""}
                    </h1>
                    <h2 className="text-xs text-neutral-400">
                        0 Post
                    </h2>
                </div>
            </div>

            {/* banner and profile picture */}
            <div className="w-full banner-aspect bg-neutral-200 rounded-xl mt-5 relative">
                {/* profile */}
                <div className={`absolute w-28 aspect-square left-6 -bottom-[25%] flex items-center justify-center`}>
                    <ProfileComponent data={profileQuery?.data?.profileImage} />
                </div>
            </div>

            {/* action button */}
            <div className="w-full mt-8 flex justify-end space-x-3">
                {
                    profileQuery.data?.id == currentUserId &&
                    <button className="w-32 h-11 bg-white border border-white rounded-lg text-neutral-900 hover:text-neutral-100 hover:bg-transparent cursor-pointer duration-100">
                        Edit profile
                    </button>
                }
                {
                    profileQuery.data?.id !== currentUserId &&
                    <>
                        <div className={`max-w-32 h-11 duration-100 rounded-lg border text-sm ${profileQuery.data?.isFollowing ? "border-neutral-100 hover:bg-transparent hover:border-rose-500 hover:text-rose-500" : "border-neutral-100 hover:bg-neutral-100 hover:text-neutral-700"}`}>
                            {
                                profileQuery.data?.isFollowing ?
                                    <button className="w-32 h-full cursor-pointer" onClick={handleUnfollow}>
                                        Unfollow
                                    </button>
                                    :
                                    <button className="w-24 h-full cursor-pointer" onClick={handleFollow}>
                                        Follow
                                    </button>
                            }
                        </div>
                    </>

                }
                <button className="w-11 h-11 grid place-content-center duration-100 border border-white rounded-lg hover:bg-white hover:text-neutral-900 cursor-pointer">
                    <EllipsisVertical />
                </button>
            </div>

            {/* user information */}
            <div className="mt-5">
                <div>
                    <h1 className="text-2xl font-bold">
                        {profileQuery.data && profileQuery.data.name || ""}
                    </h1>
                    <h2 className="text-sm text-neutral-500 mt-1">
                        @{profileQuery.data && profileQuery.data.username || ""}
                    </h2>
                </div>

                {/* {(user && user.bio) &&
                    <p className="mt-5 text-neutral-400">
                        {user.bio || ""}
                    </p>
                } */}
            </div>

            {/* join information */}
            <button className="flex items-center space-x-3 mt-5">
                <div className="flex items-center text-neutral-400 space-x-2">
                    <CalendarDays className="w-4" />
                    <span className="text-sm">
                        Join September 2026
                    </span>
                </div>
            </button>

            {/* follow infomation */}
            <div className="flex items-center space-x-3 mt-5">
                <div className="flex items-center space-x-2 text-sm`">
                    <h1 className="font-bold">
                        {profileQuery?.data?.followerCount || 0}
                    </h1>
                    <span className="text-neutral-400">
                        Followers
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm`">
                    <h1 className="font-bold">
                        {profileQuery?.data?.followingCount || 0}
                    </h1>
                    <span className="text-neutral-400">
                        Following
                    </span>
                </div>
            </div>

            {/* posts */}
            <div className="w-full border-b border-neutral-800 mt-7">
                <button className="w-24 pb-3 relative font-semibold">
                    Post
                    <div className="w-full h-[3px] rounded bg-white absolute -bottom-0">
                    </div>
                </button>

                <div className="mt-7 pb-8 space-y-5">
                    {
                        postsQuery.isPending &&
                        <PostSkeletonLoading />
                    }
                    {
                        postsQuery.data &&
                        <>
                            {
                                postsQuery.data.pages.map(page => page.items.map((item) => {
                                    return (
                                        <Post data={item} author={profileQuery.data} key={`post-${item.id}`} />
                                    )
                                }))
                            }

                            <InfiniteScrollSentinel fetchNextPage={postsQuery.fetchNextPage} hasNextPage={postsQuery.hasNextPage} isFetchingNextPage={postsQuery.isFetchingNextPage} />
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;