import { useNavigate } from "react-router-dom"
import Profile from "../../profile/Profile"
import { userKeys } from "../../../queries/userKeys";
import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "../../../services/user.service";
import { DEFAULT_GC_TIME } from "../../../consts/queryTime.const";
import FollowingButton from "../../social/FollowingButton";
import UserSummarySkeletonLoading from "../../user/UserSummarySkeletonLoading";
import UserSummary from "../../user/UserSummary";

const LargeUserSuggestions = () => {
    const navigate = useNavigate();

    // query
    const userQuery = useQuery({
        queryKey: userKeys.exploreSuggestions,
        queryFn: getSuggestedUsers,
        initialData: null,
        gcTime: DEFAULT_GC_TIME,
        staleTime: 1 * 60 * 1000,
    })

    return (
        <section className="mt-6 mb-16 space-y-6">
            <div className="rounded-lg">
                <h1 className="text-2xl font-bold text-neutral-200">
                    People to follow
                </h1>
                <div className="grid grid-cols-1 gap-6 gap-x-10 mt-8">
                    {
                        userQuery.isPending ?
                            Array.from({ length: 4 }).map((_, i) => {
                                return (
                                    <UserSummarySkeletonLoading key={`large-user-suggestion-loading-${i}`}/>
                                )
                            })
                            :
                            (userQuery.data && userQuery.data.length > 0) ?
                                <>
                                    {
                                        userQuery.data?.map((data) => (
                                            <UserSummary data={data} key={`explore-user-suggestion-${data.id}`}/>
                                        ))
                                    }
                                </>
                                :
                                <div className="w-full h-54 border border-neutral-500 rounded-xl border-dashed grid place-content-center p-5 text-center text-sm text-neutral-400">
                                    No suggestions for you
                                </div>
                    }
                </div>
            </div>
        </section>
    )
}

export default LargeUserSuggestions;