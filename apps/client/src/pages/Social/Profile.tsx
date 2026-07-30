import { Link, useNavigate, useParams } from "react-router-dom";
import GoBackIconButton from "../../components/common/GoBackIconButton";
import { CalendarDays } from "lucide-react";
import ProfileComponent from "../../components/profile/Profile";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { ERROR_RESPONSE_CODE, type ErrorResponseData, type InfiniteQuery, type PostDTO, type UserProfileDTO } from "@odiano/shared";
import ErrorState from "../../components/common/ErrorState";
import PostSkeletonLoading from "../../components/post/PostSkeletonLoading";
import Post from "../../components/post/Post";
import type { AxiosError } from "axios";
import InfiniteScrollSentinel from "../../components/common/InfiniteScrollSentinel";
import { useAppSelector } from "../../hooks/useRedux";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { createFollowing, deleteFollowing } from "../../services/following.service";
import { getUserProfile } from "../../services/user.service";
import { userKeys } from "../../queries/userKeys";
import { getUserPosts } from "../../services/post.service";
import { postKeys } from "../../queries/postKeys";
import FollowingButton from "../../components/social/FollowingButton";

const Profile = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const currentUserData = useAppSelector((state) => state.auth.user);
    const setQueryDataHandler = useSetQueryDataHandler();

    const { username } = useParams();

    // get user data
    const profileQueryKey = userKeys.profile(username);

    const profileQuery = useQuery({
        queryFn: async (): Promise<UserProfileDTO> => await getUserProfile(username!),
        enabled: !!username,
        queryKey: profileQueryKey,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
    })

    // get user posts
    const postsQuery = useInfiniteQuery({
        queryFn: ({ pageParam }) => getUserPosts(pageParam, username!),
        queryKey: postKeys.userPosts(username!),
        enabled: !!profileQuery.data,
        staleTime: 3 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<PostDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        }
    });

    const isPostsEmpty = (postsQuery.data?.pages[0].items.length == 0 && postsQuery.data?.pages.length <= 1);

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

    // display the data
    if (profileQuery.isPending) {
        return (
            <div className="w-full min-h-screen bg-black text-neutral-200 default-input-text-behaviour main-section-padding-top">
                {/* head */}
                <div className="w-full flex items-center space-x-2">
                    <GoBackIconButton />
                    <div className="space-y-1">
                        <div className="w-32 h-4 bg-neutral-700 animate-pulse rounded"></div>
                        <div className="w-20 h-4 bg-neutral-700 animate-pulse rounded"></div>
                    </div>
                </div>

                {/* banner and profile picture */}
                <div className="w-full cover-image-aspect bg-neutral-700 rounded-xl mt-5 relative animate-pulse">
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
        <>
            <div className="w-full min-h-screen bg-black text-neutral-200 main-section-padding-top">
                {/* head */}
                <div className="w-full flex items-center space-x-2">
                    <GoBackIconButton />
                    <div>
                        <h1 className="font-bold text-white">
                            {profileQuery.data && profileQuery.data.name || ""}
                        </h1>

                        {/* comming soon */}
                        {/* <h2 className="text-xs text-neutral-400">
                            0 Post
                        </h2> */}
                    </div>
                </div>

                {/* banner and profile picture */}
                <div className="w-full cover-image-aspect mt-5 relative">
                    <div className="bg-neutral-200 rounded-xl overflow-hidden w-full h-full">
                        <img src={profileQuery.data?.coverImage?.url} className="w-full h-full" />
                    </div>

                    {/* profile */}
                    <div className={`absolute w-28 aspect-square left-6 -bottom-[25%] flex items-center justify-center p-1 bg-black duration-100 rounded-full`}>
                        <ProfileComponent data={profileQuery?.data?.profileImage} />
                    </div>
                </div>

                {/* action button */}
                <div className="w-full mt-8 flex justify-end space-x-3">
                    {
                        (isAuthenticated && username == currentUserData?.username) &&
                        <Link to={`edit`}>
                            <button className="w-32 h-11 bg-white border border-white rounded-lg text-neutral-900 hover:text-neutral-100 hover:bg-transparent cursor-pointer duration-100">
                                Edit profile
                            </button>
                        </Link>
                    }
                    {
                        (!isAuthenticated || username != currentUserData?.username) &&
                        <>
                            <div role="button" className={`duration-100 h-11 ${profileQuery.data?.isFollowing ? "w-32" : "w-24"}`}>
                                <FollowingButton followMutation={followMutation} unfollowMutation={unfollowMutation} isFollowing={profileQuery.data?.isFollowing} userId={profileQuery.data?.id} />
                            </div>
                        </>

                    }

                    {/* comming soon */}
                    {/* {
                        isAuthenticated &&
                        <button className="w-11 h-11 grid place-content-center duration-100 border border-white rounded-lg hover:bg-white hover:text-neutral-900 cursor-pointer">
                            <EllipsisVertical />
                        </button>
                    } */}
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

                    {(profileQuery.data) &&
                        <p className="mt-5 text-neutral-400">
                            {profileQuery.data.bio || ""}
                        </p>
                    }
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
                                            <Post data={item} author={profileQuery.data} key={`post-${item.id}`} canDeletePost={true}/>
                                        )
                                    }))
                                }

                                <InfiniteScrollSentinel fetchNextPage={postsQuery.fetchNextPage} hasNextPage={postsQuery.hasNextPage} isFetchingNextPage={postsQuery.isFetchingNextPage} />
                            </>
                        }
                        {
                            (isPostsEmpty && !postsQuery.isPending) &&
                            <div className="w-full h-fit py-20 px-5 sm:px-10 xl:px-32 rounded-xl border border-neutral-700 border-dashed flex flex-col items-center justify-center">
                                <h1 className="text-lg font-semibold text-neutral-200">
                                    No posts yet
                                </h1>

                                {
                                    username === currentUserData?.username ? (
                                        <p className="mt-2 text-sm text-neutral-400 text-center">
                                            You haven't posted anything yet. Share your first post to let others know what's on your mind.
                                        </p>
                                    ) : (
                                        <p className="mt-2 text-sm text-neutral-400 text-center">
                                            This user hasn't posted anything yet.
                                        </p>
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;