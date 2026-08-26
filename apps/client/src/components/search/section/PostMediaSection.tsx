import { useInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_GC_TIME } from "../../../consts/queryTime.const";
import { searchKeys } from "../../../queries/searchKeys";
import { getPostsSearchResult } from "../../../services/search.service";
import type { InfiniteQuery, PostDTO } from "@odiano/shared";
import PostSkeletonLoading from "../../post/PostSkeletonLoading";
import InfiniteScrollSentinel from "../../common/InfiniteScrollSentinel";
import Post from "../../post/Post";

type Props = {
    searchQuery: string,
}

const PostMediaSection = ({ searchQuery }: Props) => {
    const postsMediaQuery = useInfiniteQuery({
        queryKey: searchKeys.postsMediaSearchResult(searchQuery!),
        queryFn: async ({ pageParam }) => await getPostsSearchResult(searchQuery, "media", pageParam),
        staleTime: 60 * 1000,
        enabled: !!(searchQuery && searchQuery.length > 0),
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<PostDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
        gcTime: DEFAULT_GC_TIME
    });

    const isDataEmpty = (postsMediaQuery.data?.pages[0].items.length == 0 && postsMediaQuery.data?.pages.length <= 1);

    // display data
    if (postsMediaQuery.isPending) {
        return (
            Array.from({ length: 3 }).map((_, i) => <PostSkeletonLoading key={`post-skeleton-${i}`} />)
        )
    }

    if (isDataEmpty && !postsMediaQuery.isPending) {
        return (
            <div className="w-full h-64 rounded-xl border border-neutral-700 border-dashed flex flex-col items-center justify-center">
                <h1 className="text-lg text-neutral-400">
                    Posts not found
                </h1>
            </div>
        )
    }

    return (
        <>
            {
                postsMediaQuery.data?.pages.map((page) =>
                    page.items.map((item) => (
                        <Post data={item} key={`post-${item.publicId}`} />
                    ))
                )
            }
            <InfiniteScrollSentinel fetchNextPage={postsMediaQuery.fetchNextPage} hasNextPage={postsMediaQuery.hasNextPage} isFetchingNextPage={postsMediaQuery.isFetchingNextPage} textForGuest="to view more posts." />
        </>
    )
}

export default PostMediaSection;