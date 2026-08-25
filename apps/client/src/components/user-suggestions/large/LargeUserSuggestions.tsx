import { useNavigate } from "react-router-dom"
import Profile from "../../profile/Profile"
import { userKeys } from "../../../queries/userKeys";
import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "../../../services/user.service";
import { DEFAULT_GC_TIME } from "../../../consts/queryTime.const";
import FollowingButton from "../../social/FollowingButton";
import LargeUserSuggestionSkeletonLoading from "./LargeUserSuggestionSkeletonLoading";

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
                            <LargeUserSuggestionSkeletonLoading />
                            :
                            (userQuery.data && userQuery.data.length > 0) ?
                                <>
                                    {
                                        userQuery.data?.map((data) => (
                                            <article onClick={() => navigate(`/profile/${data.username}`)} className="w-full flex items-start space-x-3 cursor-pointer" key={`explore-user-suggestion-${data.id}`}>
                                                <div className="w-full flex items-start space-x-3">
                                                    <div className="w-12 h-12">
                                                        <Profile data={data.profileImage} />
                                                    </div>
                                                    <div className="flex flex-1 flex-col">
                                                        <div className="w-full flex justify-between">
                                                            <div>
                                                                <h1 className="text-base font-bold truncate">
                                                                    {data.name}
                                                                </h1>
                                                                <h2 className="text-sm text-neutral-500 truncate">
                                                                    @{data.username}
                                                                </h2>
                                                            </div>
                                                            <div role="button" className={`h-9  duration-100 ${data.isFollowing ? "w-28" : "w-24"}`}>
                                                                <FollowingButton isFollowing={data.isFollowing} userId={data.id} username={data.username} />
                                                            </div>
                                                        </div>
                                                        <p className="text-neutral-300 whitespace-pre-line text-left">
                                                            {data.bio}
                                                        </p>
                                                    </div>
                                                </div>
                                            </article>
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