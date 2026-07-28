import { useMutation, useQuery } from "@tanstack/react-query";
import Profile from "../profile/Profile";
import { userKeys } from "../../queries/userKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { api } from "../../libs/api";
import type { SuccessResponseData, UserSummaryDTO } from "@odiano/shared";
import UserSuggestionsSkeletonLoading from "./UserSuggestionsSkeletonLoading";
import { createFollowing, deleteFollowing } from "../../services/following.service";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import type { AxiosErrorResponseData } from "../../types/response.type";
import { notify } from "../../helpers/notification/notify.helper";

const UserSuggestions = () => {
    const setQueryDataHandler = useSetQueryDataHandler();

    // query
    async function getSuggestedUsers(): Promise<UserSummaryDTO[]> {
        const response = await api.get<SuccessResponseData<UserSummaryDTO[]>>("/users/suggestions");

        if (!response.data.data) {
            throw new Error("Data is missing");
        }

        return response.data.data;
    }

    const userQuery = useQuery({
        queryKey: userKeys.suggestions,
        queryFn: getSuggestedUsers,
        initialData: null,
        gcTime: DEFAULT_GC_TIME,
        staleTime: 30 * 60 * 1000,
    })

    // handle mutation
    function addFollowing(oldData: UserSummaryDTO[], userId: string | undefined) {
        return oldData.map((data) => {
            if (data.username == userId) {
                return {
                    ...data,
                    isFollowing: true,
                }
            }

            return data
        })
    }

    function removeFollowing(oldData: UserSummaryDTO[], userId: string | undefined) {
        return oldData.map((data) => {
            if (data.username == userId) {
                return {
                    ...data,
                    isFollowing: false,
                }
            }

            return data;
        })
    }

    // follow mutation
    const followMutation = useMutation({
        mutationFn: createFollowing,

        onMutate: (userId) => setQueryDataHandler<UserSummaryDTO[]>(userKeys.suggestions, (oldData) => addFollowing(oldData, userId)),

        onError: (_, userId) => setQueryDataHandler<UserSummaryDTO[]>(userKeys.suggestions, (oldData) => removeFollowing(oldData, userId))
    })

    const handleFollow = async (userId: string) => {
        try {
            await followMutation.mutateAsync(userId);
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Follow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    // unfollow mutation
    const unfollowMutation = useMutation({
        mutationFn: deleteFollowing,

        onMutate: (userId) => setQueryDataHandler<UserSummaryDTO[]>(userKeys.suggestions, (oldData) => removeFollowing(oldData, userId)),

        onError: (_, userId) => setQueryDataHandler<UserSummaryDTO[]>(userKeys.suggestions, (oldData) => addFollowing(oldData, userId))
    })

    const handleUnfollow = async (userId: string) => {
        try {
            await unfollowMutation.mutateAsync(userId);
        } catch (err) {
            const error = err as AxiosErrorResponseData;

            notify.error({ "title": "Unfollow failed", "description": error.response?.data.message || "Something went wrong" });
        }
    }

    return (
        <section className="w-full hidden sm:flex flex-col">
            <h1 className="font-semibold">
                Suggested for you
            </h1>
            <div className="w-full mt-5 space-y-4">
                {
                    userQuery.isPending ?
                        <>
                            <UserSuggestionsSkeletonLoading />
                        </>
                        :
                        <>
                            {
                                userQuery.data ?
                                    <>
                                        {
                                            userQuery.data?.map((data) => (
                                                <article className="w-full flex items-center space-x-2" key={`user-suggestion-${data.id}`}>
                                                    <div className="w-12 h-12">
                                                        <Profile data={data.profileImage} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h1 className="text-sm font-bold">
                                                            {data.name}
                                                        </h1>
                                                        <h2 className="text-sm text-neutral-400">
                                                            @{data.username}
                                                        </h2>
                                                    </div>
                                                    {
                                                        !data.isFollowing?
                                                        <button className="w-24 h-10 bg-white rounded-lg text-neutral-900 text-sm border border-white hover:bg-transparent hover:text-white duration-100 cursor-pointer" onClick={() => handleFollow(data.id)}>
                                                            Follow
                                                        </button>
                                                        :
                                                        <button className="w-24 h-10 bg-white rounded-lg text-neutral-900 text-sm border border-white hover:bg-transparent hover:text-white duration-100 cursor-pointer" onClick={() => handleUnfollow(data.id)}>
                                                            Unfollow
                                                        </button>
                                                    }
                                                </article>
                                            ))
                                        }
                                    </>
                                    :
                                    <div className="w-full h-54 border border-neutral-500 rounded-xl border-dashed grid place-content-center p-5 text-center text-sm text-neutral-400">
                                        No suggestions for you
                                    </div>
                            }
                        </>
                }
            </div>
        </section>
    )
}

export default UserSuggestions;