import { useQuery } from "@tanstack/react-query";
import Profile from "../../profile/Profile";
import { userKeys } from "../../../queries/userKeys";
import { DEFAULT_GC_TIME } from "../../../consts/queryTime.const";
import SmallUserSuggestionsSkeletonLoading from "./SmallUserSuggestionsSkeletonLoading";
import { Link } from "react-router-dom";
import FollowingButton from "../../social/FollowingButton";
import { getSuggestedUsers } from "../../../services/user.service";

const SmallUserSuggestions = () => {
    // query
    const userQuery = useQuery({
        queryKey: userKeys.sidebarSuggestions,
        queryFn: getSuggestedUsers,
        initialData: null,
        gcTime: DEFAULT_GC_TIME,
        staleTime: 1 * 60 * 1000,
    })

    return (
        <section className="w-full hidden sm:flex flex-col">
            <h1 className="font-semibold">
                Suggested for you
            </h1>
            <div className="w-full mt-5 space-y-4">
                {
                    userQuery.isPending ?
                        <>
                            <SmallUserSuggestionsSkeletonLoading />
                        </>
                        :
                        <>
                            {
                                (userQuery.data && userQuery.data.length > 0) ?
                                    <>
                                        {
                                            userQuery.data?.map((data) => (
                                                <article className="w-full flex items-center" key={`user-suggestion-${data.id}`}>
                                                    <Link to={`/profile/${data.username}`} className="flex flex-1 items-center space-x-2">
                                                        <div className="w-12 h-12">
                                                            <Profile data={data.profileImage} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h1 className="text-sm font-bold truncate">
                                                                {data.name}
                                                            </h1>
                                                            <h2 className="text-sm text-neutral-400 truncate">
                                                                @{data.username}
                                                            </h2>
                                                        </div>
                                                    </Link>

                                                    <div role="button" className={`h-9  duration-100 ${data.isFollowing ? "w-28" : "w-24"}`}>
                                                        <FollowingButton isFollowing={data.isFollowing} userId={data.id} username={data.username}/>
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
                        </>
                }
            </div>
        </section>
    )
}

export default SmallUserSuggestions;