import { useInfiniteQuery } from "@tanstack/react-query";
import { postKeys } from "../../queries/postKeys";
import { getPosts } from "../../services/post.service";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import type { InfiniteQuery, PostDTO } from "@odiano/shared";
import PostSkeletonLoading from "../../components/post/PostSkeletonLoading";
import Post from "../../components/post/Post";
import InfiniteScrollSentinel from "../../components/common/InfiniteScrollSentinel";
import LargeUserSuggestions from "../../components/user-suggestions/large/LargeUserSuggestions";
import SEO from "../../components/seo/SEO";

const Explore = () => {
    const postsQueryKey = postKeys.all;

    const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryFn: ({ pageParam }) => getPosts(pageParam),
        queryKey: postsQueryKey,
        staleTime: 10 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<PostDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        }
    })

    const isDataEmpty = (data?.pages[0].items.length == 0 && data?.pages.length <= 1);

    return (
        <>
            <SEO title="Explore" />

            <div className="sm:pb-6">
                {/* trending this week */}
                {/* <section className="w-full py-6">
                <div className="w-full rounded-lg">
                    <h1 className="text-2xl font-bold text-neutral-200">
                        Trending this week
                    </h1>
                    <div className="grid grid-cols-3 grid-row-4 gap-3 mt-8">
                        {
                            Array.from({ length: 6 }).map((_, i) => (
                                <Link to={`/`} key={`trending-post-${i}`} className="flex items-center justify-center space-x-3 rounded-lg border border-neutral-800 p-3">
                                    <div className="flex-1">
                                        <div className="text-base font-bold text-neutral-300">
                                            #Javascript
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            12 posts
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </section> */}
                {/* user suggestions */}
                <LargeUserSuggestions />

                <section className="mt-6">
                    <h1 className="text-2xl font-bold text-neutral-200">
                        Posts for you
                    </h1>
                    <div className="w-full mt-6">
                        {
                            isPending &&
                            Array.from({ length: 3 }).map((_, i) => <PostSkeletonLoading key={`post-skeleton-${i}`} />)
                        }
                        {
                            (isDataEmpty && isPending) &&
                            <div className="w-full h-fit py-20 px-32 rounded-xl border border-neutral-700 border-dashed flex flex-col items-center justify-center">
                                <h1 className="text-lg font-semibold text-neutral-200">
                                    No posts yet
                                </h1>

                                <p className="mt-2 text-sm text-neutral-400 text-center">
                                    There are no posts to display right now. Check back later or follow more people to see content in your feed.
                                </p>
                            </div>
                        }
                        {
                            !isDataEmpty &&
                            <>
                                {
                                    data?.pages.map((page) =>
                                        page.items.map((item) => (
                                            <Post data={item} key={`post-${item.publicId}`} />
                                        ))
                                    )
                                }
                                <InfiniteScrollSentinel fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} textForGuest="to view more posts." />
                            </>
                        }
                    </div>
                </section>
            </div>
        </>
    )
}

export default Explore;