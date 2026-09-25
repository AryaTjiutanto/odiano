import { useQuery } from "@tanstack/react-query";
import UserSummarySkeletonLoading from "../../user/UserSummarySkeletonLoading";
import { searchKeys } from "../../../queries/searchKeys";
import { getUsersSearchResult } from "../../../services/search.service";
import type { UserSummaryDTO } from "@odiano/shared";
import { DEFAULT_GC_TIME } from "../../../consts/queryTime.const";
import UserSummary from "../../user/UserSummary";

type Props = {
    searchQuery: string,
}

const PeopleSection = ({ searchQuery }: Props) => {
    const usersQuery = useQuery<UserSummaryDTO[]>({
        queryKey: searchKeys.usersSearchResult(searchQuery!),
        queryFn: () => getUsersSearchResult(searchQuery),
        staleTime: 60 * 1000,
        enabled: !!(searchQuery && searchQuery.length > 0),
        gcTime: DEFAULT_GC_TIME
    });

    const isDataEmpty = (!usersQuery.data || usersQuery.data?.length <= 0);

    // display data
    if (usersQuery.isPending) {
        return (
            Array.from({ length: 5 }).map((_, i) => <UserSummarySkeletonLoading key={`user-summary-skeleton-${i}`} />)
        )
    }

    if (isDataEmpty && !usersQuery.isPending) {
        return (
            <div className="w-full h-64 rounded-xl border border-neutral-700 border-dashed flex flex-col items-center justify-center">
                <h1 className="text-lg text-neutral-400">
                    User not found
                </h1>
            </div>
        )
    }

    return (
        usersQuery.data?.map((user, i) => <UserSummary key={`user-search-result-${i}`} data={user} usernameLocation="bottom"/>)
    )
}

export default PeopleSection;