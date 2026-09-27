import { X } from "lucide-react";
import { useUserFollowList } from "../../providers/UserFollowListProvider";
import { USER_FOLLOW_LIST_TYPE } from "../../types/user.type";
import { useAppSelector } from "../../hooks/useRedux";
import { Link } from "react-router-dom";
import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { userKeys } from "../../queries/userKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { getUserFollowers, getUserFollowing } from "../../services/user.service";
import type { InfiniteQuery, UserSummaryDTO } from "@odiano/shared";
import UserSummary from "../user/UserSummary";
import InfiniteScrollSentinel from "../common/InfiniteScrollSentinel";
import UserSummarySkeletonLoading from "../user/UserSummarySkeletonLoading";
import ModalContainer from "./ModalContainer";

const UserFollowListModal = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const currentUserData = useAppSelector(state => state.auth.user);
    const { closeModal, selectedFollowListType, followCount, targetUserId } = useUserFollowList();

    // query
    function getUserFollowList({ pageParam }: QueryFunctionContext<string[], string | null>): Promise<InfiniteQuery<UserSummaryDTO[]>> {
        if (selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWERS) {
            return getUserFollowers(targetUserId!, pageParam);
        }

        return getUserFollowing(targetUserId!, pageParam);
    };

    const queryKey = selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWERS ? userKeys.userFollowers(targetUserId!) : userKeys.userFollowing(targetUserId!);

    const userFollowListQuery = useInfiniteQuery({
        queryFn: getUserFollowList,
        queryKey: queryKey,
        enabled: !!(selectedFollowListType && isAuthenticated && targetUserId),
        staleTime: 60 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<UserSummaryDTO[]>) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    })

    if (!targetUserId) return null;

    // display
    if (!isAuthenticated) {
        return (
            <ModalContainer closeModalHandler={closeModal}>
                <div className="h-72 md:w-[500px] rounded-lg grid place-content-center px-10 text-center">
                    <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-3 right-3" onClick={closeModal}>
                        <X className="w-5" />
                    </button>

                    <div>
                        <Link to={"/signin"} className="text-sky-500 underline hover:text-sky-400 duration-100">
                            Signin
                        </Link> {""}
                        or {""}
                        <Link to={"/signup"} className="text-sky-500 underline hover:text-sky-400 duration-100">
                            Create an account
                        </Link> {""}
                        to view this content
                    </div>
                </div>
            </ModalContainer>
        )
    }

    if (followCount <= 0) {
        return (
            <ModalContainer closeModalHandler={closeModal}>
                <div className="h-72 md:w-[500px] grid place-content-center px-10 text-center relative">
                    <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-3 right-3" onClick={closeModal}>
                        <X className="w-5" />
                    </button>

                    <div className="py-12 text-center">
                        <h2 className="text-lg font-bold text-white">
                            {selectedFollowListType === USER_FOLLOW_LIST_TYPE.FOLLOWERS
                                ? "No followers yet"
                                : "Not following anyone yet"}
                        </h2>

                        <p className="mt-1 text-sm text-neutral-400">
                            This list is currently empty.
                        </p>
                    </div>
                </div>
            </ModalContainer>
        )
    }

    return (
        <ModalContainer closeModalHandler={closeModal}>
            <div className="md:w-[500px]">
                {/* head */}
                <div className="w-full h-14 flex items-center justify-center border-neutral-700 border-b text-center relative">
                    <h1 className="text-lg font-semibold">
                        {
                            selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWERS &&
                            "Followers"
                        }
                        {
                            selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWING &&
                            "Following"
                        }
                    </h1>

                    <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-0 bottom-0 my-auto right-3" onClick={closeModal}>
                        <X className="w-5" />
                    </button>
                </div>

                {/* content */}
                <div className="w-full py-2">
                    {/* search input */}
                    {/* <div className="w-full px-4 pb-2 bg-[#101010]">
                        <form className="flex items-center bg-neutral-900 h-10 rounded-xl">
                            <input className="flex-1 h-full default-input-text-behaviour px-3 text-sm text-neutral-300" placeholder="Search..."></input>
                            <button className="h-full w-8 group">
                                <Search className="w-4 group-hover:text-neutral-400 cursor-pointer" />
                            </button>
                        </form>
                    </div> */}

                    {/* user list */}
                    <div className="w-full max-h-[45vh] duration-100 overflow-y-auto py-5 px-4">
                        {
                            userFollowListQuery.isPending &&
                            <div className="space-y-4">
                                {
                                    Array.from({ length: 5 }).map((_, key) => (
                                        <UserSummarySkeletonLoading key={`skeleton-${key}`} usernameLocation="right" bioLength="short" />
                                    ))
                                }
                            </div>
                        }
                        {
                            (!userFollowListQuery.isPending) &&
                            <>
                                {
                                    (userFollowListQuery.data?.pages[0]?.items.length ?? 0) >= 1 ? userFollowListQuery.data?.pages.map((page, index) => (
                                        <div key={`page-${index}`}>
                                            <div className="space-y-4 mb-4 last:mb-0">
                                                {
                                                    page.items.map((item) => (
                                                        <UserSummary data={item} key={`following-${item.id}`} bioLength="short" usernameLocation="right" fn={closeModal} followListUserId={targetUserId} />
                                                    ))
                                                }
                                            </div>

                                            <InfiniteScrollSentinel hasNextPage={page.hasNextPage} fetchNextPage={userFollowListQuery.fetchNextPage} isFetchingNextPage={userFollowListQuery.isFetchingNextPage} />
                                        </div>
                                    ))
                                        :
                                        <>
                                            {
                                                selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWING &&
                                                <div className="w-full h-32 border border-dashed border-neutral-700 rounded grid place-content-center p-5 text-center text-sm text-neutral-500">
                                                    {
                                                        targetUserId == currentUserData?.id ?
                                                            "You haven't followed anyone yet"
                                                            :
                                                            "This user hasn't followed anyone yet"
                                                    }
                                                </div>
                                            }
                                            {
                                                selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWERS &&
                                                <div className="w-full h-32 border border-dashed border-neutral-700 rounded grid place-content-center p-5 text-center text-sm text-neutral-500">
                                                    {
                                                        targetUserId == currentUserData?.id ?
                                                            "You doesnt have any followers yet"
                                                            :
                                                            "This user doesn't have any followers yet"
                                                    }
                                                </div>
                                            }
                                        </>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        </ModalContainer>
    )
}

export default UserFollowListModal;