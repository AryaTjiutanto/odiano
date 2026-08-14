import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchKeys } from "../../queries/searchKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { getSearchResult } from "../../services/search.service";
import PostSkeletonLoading from "../../components/post/PostSkeletonLoading";
import Post from "../../components/post/Post";
import type { InfiniteQuery, PostDTO } from "@odiano/shared";
import InfiniteScrollSentinel from "../../components/common/InfiniteScrollSentinel";
import { useSearchInputContext } from "../../providers/SearchInputProvider";

const Search = () => {
    const searchInputContext = useSearchInputContext();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q");

    useEffect(() => {
        document.title = `${searchQuery || "Search"} - Odiano`;
        searchInputContext.setQuery(searchQuery || "");
    }, [searchQuery]);

    const postsQuery = useInfiniteQuery({
        queryKey: searchKeys.search(searchQuery!),
        queryFn: async () => await getSearchResult(searchQuery),
        staleTime: 60 * 1000,
        enabled: !!(searchQuery && searchQuery.length > 0),
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<PostDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
        gcTime: DEFAULT_GC_TIME
    });

    const isDataEmpty = (postsQuery.data?.pages[0].items.length == 0 && postsQuery.data?.pages.length <= 1);

    return (
        <>
            {/* head */}
            <title>search - Odiano</title>
            <meta
                name="description"
                content="odiano with friends, share posts, and explore communities."
            />

            {/* body */}
            <div className="mt-2 space-y-6 sm:pb-6">
                {
                    postsQuery.isPending &&
                    Array.from({ length: 3 }).map((_, i) => <PostSkeletonLoading key={`post-skeleton-${i}`} />)
                }
                {
                    postsQuery.data &&
                    <>
                        {
                            postsQuery.data?.pages.map((page) =>
                                page.items.map((item) => (
                                    <Post data={item} key={`post-${item.publicId}`} />
                                ))
                            )
                        }
                        <InfiniteScrollSentinel fetchNextPage={postsQuery.fetchNextPage} hasNextPage={postsQuery.hasNextPage} isFetchingNextPage={postsQuery.isFetchingNextPage} textForGuest="to view more posts." />
                    </>
                }

                {
                    (isDataEmpty && !postsQuery.isPending) &&
                    <div className="w-full h-fit py-20 px-32 rounded-xl border border-neutral-700 border-dashed flex flex-col items-center justify-center">
                        <h1 className="text-lg font-semibold text-neutral-200">
                            No posts yet
                        </h1>

                        <p className="mt-2 text-sm text-neutral-400 text-center">
                            There are no posts to display right now. Check back later or follow more people to see content in your feed.
                        </p>
                    </div>
                }
            </div>
        </>
    )
}

export default Search;