import type { UseMutationResult } from "@tanstack/react-query";
import { notify } from "../../helpers/notification/notify.helper";
import type { AxiosErrorResponseData } from "../../types/response.type";

type Props = {
    unfollowMutation: UseMutationResult<any, Error, string | undefined, void>,
    followMutation: UseMutationResult<any, Error, string | undefined, void>,
    isFollowing : boolean | undefined,
    userId : string | undefined,
}

const FollowingButton = ({ followMutation, unfollowMutation, isFollowing, userId }: Props) => {
    const handleFollow = async (userId: string) => {
        try {
            await followMutation.mutateAsync(userId);
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Follow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    const handleUnfollow = async (userId: string) => {
        try {
            await unfollowMutation.mutateAsync(userId);
        } catch (err) {
            const error = err as AxiosErrorResponseData;
            
            notify.error({ "title": "Unfollow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }
    
    // handle following
    const handleFollowing = () => {
        if(!userId) return;
        if (followMutation.isPending || unfollowMutation.isPending) return;
        
        if (isFollowing) {
            return handleUnfollow(userId);
        }

        return handleFollow(userId);
    }

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