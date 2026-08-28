import { useMutation } from "@tanstack/react-query";
import { notify } from "../../helpers/notification/notify.helper";
import type { AxiosErrorResponseData } from "../../types/response.type";
import { useAppSelector } from "../../hooks/useRedux";
import type { MouseEvent } from "react";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import type { UserProfileDTO, UserSummaryDTO } from "@odiano/shared";
import { markProfileAsFollowed, markProfileAsUnfollowed, markUserAsFollowedInList, markUserAsUnfollowedInList } from "../../helpers/cache/userCache.helper";
import { userKeys } from "../../queries/userKeys";
import { createFollowing, deleteFollowing } from "../../services/following.service";
import type { IsFollowingData } from "../../types/following.type";
import { useNavigate } from "react-router-dom";

type Props = {
    isFollowing: boolean | undefined,
    userId: string | undefined,
    username: string | undefined,
}

export type FollowingMutationData = {
    userId: string | undefined,
    username: string | undefined
}

const FollowingButton = ({ isFollowing, userId, username }: Props) => {
    const setQueryDataHandler = useSetQueryDataHandler();
    const navigate = useNavigate();
    const currentUserData = useAppSelector(state => state.auth.user);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    const followingHandler = (userId: string | undefined, username: string | undefined) => {
        if (!userId || !username) return;

        setQueryDataHandler<UserSummaryDTO[]>(userKeys.exploreSuggestions, (oldData) => markUserAsFollowedInList(oldData, userId));
        setQueryDataHandler<UserSummaryDTO[]>(userKeys.sidebarSuggestions, (oldData) => markUserAsFollowedInList(oldData, userId));
        setQueryDataHandler<UserProfileDTO>(userKeys.profile(username), (oldData) => markProfileAsFollowed(oldData));
        setQueryDataHandler<IsFollowingData>(userKeys.isFollowing(username), (oldData) => ({
            ...oldData,
            isFollowing: true,
        }));
    }

    const unfollowingHandler = (userId: string | undefined, username: string | undefined) => {
        if (!userId || !username) return;

        setQueryDataHandler<UserSummaryDTO[]>(userKeys.exploreSuggestions, (oldData) => markUserAsUnfollowedInList(oldData, userId));
        setQueryDataHandler<UserSummaryDTO[]>(userKeys.sidebarSuggestions, (oldData) => markUserAsUnfollowedInList(oldData, userId));
        setQueryDataHandler<UserProfileDTO>(userKeys.profile(username), (oldData) => markProfileAsUnfollowed(oldData));
        setQueryDataHandler<IsFollowingData>(userKeys.isFollowing(username), (oldData) => ({
            ...oldData,
            isFollowing: false,
        }));
    }

    // mutation
    const followMutation = useMutation({
        mutationFn: ({ userId }: FollowingMutationData) => createFollowing(userId),
        onMutate: ({ userId, username }: FollowingMutationData) => followingHandler(userId, username),
        onError: (_, { userId, username }: FollowingMutationData) => unfollowingHandler(userId, username)
    })

    const unfollowMutation = useMutation({
        mutationFn: ({ userId }: FollowingMutationData) => deleteFollowing(userId),
        onMutate: ({ userId, username }: FollowingMutationData) => unfollowingHandler(userId, username),
        onError: (_, { userId, username }: FollowingMutationData) => followingHandler(userId, username)
    })

    const handleFollow = async () => {
        try {
            await followMutation.mutateAsync({userId, username});
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Follow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    const handleUnfollow = async () => {
        try {
            await unfollowMutation.mutateAsync({userId, username});
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Unfollow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    // handle following
    const handleFollowing = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if(!currentUserData?.isEmailVerified || !currentUserData?.isOnboarded) {
            return navigate("/onboarding");
        }

        if (!userId) return;
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