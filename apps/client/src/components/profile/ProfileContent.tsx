import type { InfiniteQuery, PostDTO, UserProfileDTO } from "@odiano/shared";
import GoBackIconButton from "../common/GoBackIconButton";
import { useAppSelector } from "../../hooks/useRedux";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import FollowingButton from "../social/FollowingButton";
import { CalendarDays } from "lucide-react";
import { useUserFollowList } from "../../providers/UserFollowListProvider";
import { postKeys } from "../../queries/postKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../services/post.service";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import PostSkeletonLoading from "../post/PostSkeletonLoading";
import InfiniteScrollSentinel from "../common/InfiniteScrollSentinel";
import Post from "../post/Post";

type Props = {
    targetUsername: string,
    queryData: UserProfileDTO,
}

const ProfileContent = ({ queryData, targetUsername }: Props) => {
    const followListModal = useUserFollowList();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const currentUserData = useAppSelector((state) => state.auth.user);

    // get user posts
    const postsQuery = useInfiniteQuery({
        queryFn: ({ pageParam }) => getUserPosts(pageParam, targetUsername!),
        queryKey: postKeys.userPosts(targetUsername!),
        enabled: !!queryData,
        staleTime: 3 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<PostDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        }
    });

    const isPostsEmpty = (postsQuery.data?.pages[0].items.length == 0 && postsQuery.data?.pages.length <= 1);

    return (
        <>
            <div className="w-full min-h-screen bg-black text-neutral-200 sm:main-section-padding-top">
                {/* head */}
                <div className={`w-full ${isAuthenticated && targetUsername == currentUserData?.username ? "hidden sm:flex" : "flex"} main-section-padding-top items-center space-x-2`}>
                    <GoBackIconButton />
                    <div className="space-y-1">
                        <h1 className="font-bold text-lg text-white">
                            {queryData && queryData.name || ""}
                        </h1>

                        <h2 className="text-xs text-neutral-400">
                            {queryData && queryData.totalPosts || 0} Post
                        </h2>
                    </div>
                </div>

                {/* banner and profile picture */}
                <div className="w-full cover-image-aspect mt-5 relative">
                    <div className="bg-neutral-200 rounded-xl overflow-hidden w-full h-full">
                        <img src={queryData?.coverImage?.url} className="w-full h-full" />
                    </div>

                    {/* profile */}
                    <div className={`absolute w-28 xl:w-30 aspect-square left-3 sm:left-6 -bottom-[50%] sm:-bottom-[30%] flex items-center justify-center p-1 bg-black duration-100 rounded-full`}>
                        <Profile data={queryData.profileImage} />
                    </div>
                </div>

                {/* action button */}
                <div className="w-full mt-5 hidden sm:flex justify-end space-x-3">
                    {
                        (isAuthenticated && targetUsername == currentUserData?.username) &&
                        <Link to={`/profile/edit`}>
                            <button className="w-32 h-11 bg-white border border-white rounded-lg text-neutral-900 hover:text-neutral-100 hover:bg-transparent cursor-pointer duration-100">
                                Edit profile
                            </button>
                        </Link>
                    }
                    {
                        (!isAuthenticated || targetUsername != currentUserData?.username) &&
                        <>
                            <div role="button" className={`duration-100 h-11 ${queryData?.isFollowing ? "w-32" : "w-24"}`}>
                                <FollowingButton isFollowing={queryData?.isFollowing} targetUserId={queryData?.id} targetUsername={queryData?.username} />
                            </div>
                        </>

                    }

                    {/* {
                        isAuthenticated &&
                        <UserMenu userId={queryData?.id} username={queryData?.username} />
                    } */}
                </div>

                {/* user information */}
                <div className="mt-16 sm:mt-2">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {queryData && queryData.name || ""}
                        </h1>
                        <h2 className="text-sm text-neutral-500 mt-1">
                            @{queryData && queryData.username || ""}
                        </h2>
                    </div>

                    {(queryData) &&
                        <p className="mt-5 text-neutral-400">
                            {queryData.bio || ""}
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
                    <button className="flex items-center space-x-2 text-sm cursor-pointer" onClick={() => followListModal.openFollowersModal(queryData.followerCount || 0, queryData.id)}>
                        <h1 className="font-bold">
                            {queryData.followerCount || 0}
                        </h1>
                        <span className="text-neutral-400">
                            Followers
                        </span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm cursor-pointer" onClick={() => followListModal.openFollowingModal(queryData.followingCount || 0, queryData.id)}>
                        <h1 className="font-bold">
                            {queryData.followingCount || 0}
                        </h1>
                        <span className="text-neutral-400">
                            Following
                        </span>
                    </button>
                </div>

                {/* action button - mobile */}
                <div className="mt-8">
                    {
                        (isAuthenticated && targetUsername == currentUserData?.username) &&
                        <Link to={`/profile/edit`}>
                            <button className="w-32 h-11 bg-white border border-white rounded-lg text-neutral-900 hover:text-neutral-100 hover:bg-transparent cursor-pointer duration-100">
                                Edit profile
                            </button>
                        </Link>
                    }
                    {
                        (!isAuthenticated || targetUsername != currentUserData?.username) &&
                        <>
                            <div role="button" className={`duration-100 h-11 ${queryData?.isFollowing ? "w-32" : "w-24"}`}>
                                <FollowingButton isFollowing={queryData?.isFollowing} targetUserId={queryData?.id} targetUsername={queryData?.username} />
                            </div>
                        </>

                    }
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
                                            <Post data={item} author={queryData} key={`post-${item.id}`} />
                                        )
                                    }))
                                }

                                <InfiniteScrollSentinel fetchNextPage={postsQuery.fetchNextPage} hasNextPage={postsQuery.hasNextPage} isFetchingNextPage={postsQuery.isFetchingNextPage} textForGuest={`to see @${queryData?.username} full profile`} />
                            </>
                        }
                        {
                            (isPostsEmpty && !postsQuery.isPending) &&
                            <div className="w-full h-fit py-20 px-5 sm:px-10 xl:px-32 rounded-xl border border-neutral-700 border-dashed flex flex-col items-center justify-center">
                                <h1 className="text-lg font-semibold text-neutral-200">
                                    No posts yet
                                </h1>

                                {
                                    targetUsername === currentUserData?.username ? (
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

export default ProfileContent;