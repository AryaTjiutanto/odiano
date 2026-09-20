import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "../../helpers/notification/notify.helper";
import type { AxiosErrorResponseData } from "../../types/response.type";
import { useAppSelector } from "../../hooks/useRedux";
import type { MouseEvent } from "react";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { type UserProfileDTO, type UserSummaryDTO } from "@odiano/shared";
import { markProfileAsFollowed, markProfileAsUnfollowed, markUserAsFollowedInInfiniteList, markUserAsFollowedInList, markUserAsUnfollowedInInfiniteList, markUserAsUnfollowedInList } from "../../helpers/cache/userCache.helper";
import { userKeys } from "../../queries/userKeys";
import { createFollowing, deleteFollowing } from "../../services/following.service";
import type { IsFollowingData } from "../../types/following.type";
import { useNavigate } from "react-router-dom";
import type { InfiniteQueryUserSummaryDTO } from "../../types/user.type";

type Props = {
    isFollowing: boolean | undefined,

    targetUserId: string | undefined,
    targetUsername: string | undefined,

    followListUserId?: string | undefined,
}

// ============================================================================
// note : dont pass the targetUserId and targetUsername to the function

const FollowingButton = ({ isFollowing, targetUserId, targetUsername, followListUserId }: Props) => {
    if (!targetUserId || !targetUsername) return null;

    const setQueryDataHandler = useSetQueryDataHandler();
    const navigate = useNavigate();
    const currentUserData = useAppSelector(state => state.auth.user);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const queryClient = useQueryClient();

    const followingHandler = () => {
        // suggestion
        setQueryDataHandler<UserSummaryDTO[]>(userKeys.exploreSuggestions, (oldData) => markUserAsFollowedInList(oldData, targetUserId));
        setQueryDataHandler<UserSummaryDTO[]>(userKeys.sidebarSuggestions, (oldData) => markUserAsFollowedInList(oldData, targetUserId));

        // target user profile
        setQueryDataHandler<UserProfileDTO>(userKeys.profile(targetUsername), (oldData) => markProfileAsFollowed(oldData));

        // target user followers
        queryClient.invalidateQueries({ queryKey: userKeys.userFollowers(targetUserId) });

        // current user follow list
        if (followListUserId !== currentUserData?.id) {
            queryClient.invalidateQueries({ queryKey: userKeys.userFollowing(currentUserData!.id) });
        }

        // is following
        setQueryDataHandler<IsFollowingData>(userKeys.isFollowing(targetUsername), (oldData) => ({
            ...oldData,
            isFollowing: true,
        }));


        // user follow list
        if (followListUserId) {
            setQueryDataHandler<InfiniteQueryUserSummaryDTO>(userKeys.userFollowing(followListUserId), (oldData) => markUserAsFollowedInInfiniteList(oldData, targetUserId));
            setQueryDataHandler<InfiniteQueryUserSummaryDTO>(userKeys.userFollowers(followListUserId), (oldData) => markUserAsFollowedInInfiniteList(oldData, targetUserId));
        }

        // increase currentUser following count
        setQueryDataHandler<UserProfileDTO>(userKeys.profile(currentUserData?.username), (oldData) => ({
            ...oldData,
            followingCount: oldData.followingCount + 1,
        }));
    }
    
    const unfollowingHandler = () => {
        if (!targetUserId || !targetUsername) return;

        // suggestion
        setQueryDataHandler<UserSummaryDTO[]>(userKeys.exploreSuggestions, (oldData) => markUserAsUnfollowedInList(oldData, targetUserId));
        setQueryDataHandler<UserSummaryDTO[]>(userKeys.sidebarSuggestions, (oldData) => markUserAsUnfollowedInList(oldData, targetUserId));
        
        // profile
        setQueryDataHandler<UserProfileDTO>(userKeys.profile(targetUsername), (oldData) => markProfileAsUnfollowed(oldData));
        
        // target user followers
        queryClient.invalidateQueries({ queryKey: userKeys.userFollowers(targetUserId) });

        // current user follow list
        if (followListUserId !== currentUserData?.id) {
            queryClient.invalidateQueries({ queryKey: userKeys.userFollowing(currentUserData!.id) });
        }
        
        // is following
        setQueryDataHandler<IsFollowingData>(userKeys.isFollowing(targetUsername), (oldData) => ({
            ...oldData,
            isFollowing: false,
        }));


        // user follow list
        if (followListUserId && followListUserId !== currentUserData?.id) {
            setQueryDataHandler<InfiniteQueryUserSummaryDTO>(userKeys.userFollowing(followListUserId), (oldData) => markUserAsUnfollowedInInfiniteList(oldData, targetUserId));
            setQueryDataHandler<InfiniteQueryUserSummaryDTO>(userKeys.userFollowers(followListUserId), (oldData) => markUserAsUnfollowedInInfiniteList(oldData, targetUserId));
            
        }
        
        if (followListUserId && followListUserId == currentUserData?.id) {
            setQueryDataHandler<InfiniteQueryUserSummaryDTO>(userKeys.userFollowing(followListUserId), (oldData) => {
                return {
                    ...oldData,
                    
                    pages: oldData.pages.map((page) => {
                        return {
                            ...page,
                            
                            items: page.items.filter((item) => item.id !== targetUserId),
                        };
                    }),
                };
            });
        }

        // decrese currentUser following count
        setQueryDataHandler<UserProfileDTO>(userKeys.profile(currentUserData?.username), (oldData) => ({
            ...oldData,
            followingCount: oldData.followingCount - 1,
        }));
    }

    // mutation
    const followMutation = useMutation({
        mutationFn: () => createFollowing(targetUserId),
        onMutate: followingHandler,
        onError: unfollowingHandler
    })

    const unfollowMutation = useMutation({
        mutationFn: () => deleteFollowing(targetUserId),
        onMutate: unfollowingHandler,
        onError: followingHandler
    })

    const handleFollow = async () => {
        try {
            await followMutation.mutateAsync();
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Follow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    const handleUnfollow = async () => {
        try {
            await unfollowMutation.mutateAsync();
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Unfollow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    // handle following
    const handleFollowing = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (!currentUserData?.isEmailVerified || !currentUserData?.isOnboarded) {
            return navigate("/onboarding");
        }

        if (!targetUserId) return;
        if (followMutation.isPending || unfollowMutation.isPending) return;

        if (isFollowing) {
            return handleUnfollow();
        }

        return handleFollow();
    }

    if (!isAuthenticated) return;

    return (
        <button className={`w-full h-full bg-white rounded-lg text-neutral-900 text-sm border border-white hover:bg-transparent duration-100 cursor-pointer group font-semibold ${isFollowing ? "hover:text-rose-500 hover:border-rose-500" : "hover:text-white"}`} onClick={handleFollowing}>
            {
                isFollowing ?
                    <div>
                        <span className="inline-block group-hover:hidden">
                            Following
                        </span>
                        <span className="group-hover:inline-block hidden">
                            Unfollow
                        </span>
                    </div>
                    :
                    "Follow"
            }
        </button>
    )
}

export default FollowingButton;