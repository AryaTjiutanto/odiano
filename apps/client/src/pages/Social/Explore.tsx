import { useInfiniteQuery } from "@tanstack/react-query";
import { postKeys } from "../../queries/postKeys";
import { getPosts } from "../../services/post.service";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import type { InfiniteQuery, PostDTO } from "@odiano/shared";
import PostSkeletonLoading from "../../components/post/PostSkeletonLoading";
import Post from "../../components/post/Post";
import InfiniteScrollSentinel from "../../components/common/InfiniteScrollSentinel";
import { Link } from "react-router-dom";
import Profile from "../../components/profile/Profile";

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

    if (isPending) {
        return (
            Array.from({ length: 3 }).map((_, i) => <PostSkeletonLoading key={`post-skeleton-${i}`} />)
        )
    }

    if (isDataEmpty && !isPending) {
        return (
            <div className="w-full h-fit py-20 px-32 rounded-xl border border-neutral-700 border-dashed flex flex-col items-center justify-center">
                <h1 className="text-lg font-semibold text-neutral-200">
                    No posts yet
                </h1>

                <p className="mt-2 text-sm text-neutral-400 text-center">
                    There are no posts to display right now. Check back later or follow more people to see content in your feed.
                </p>
            </div>
        )
    }

    return (
        <div className="sm:pb-6">
            {/* trending this week */}
            <section className="w-full py-6">
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
            </section>
            {/* user suggestions */}
            <section className="mt-6 mb-16 space-y-6">
                <div className="rounded-lg">
                    <h1 className="text-2xl font-bold text-neutral-200">
                        People to follow
                    </h1>
                    <div className="grid grid-cols-1 gap-6 gap-x-10 mt-8">
                        {
                            Array.from({ length: 4 }).map((_, i) => (
                                <Link to={`/`} className="">
                                    <div className="w-full flex items-start space-x-3" key={`user-suggestion-${0}`}>
                                        <div className="w-12 h-12">
                                            <Profile data={null} />
                                        </div>
                                        <div className="flex flex-1 flex-col items-center">
                                            <div className="w-full flex justify-between">
                                                <div>
                                                    <h1 className="text-base font-bold truncate">
                                                        John Does
                                                    </h1>
                                                    <h2 className="text-sm text-neutral-500 truncate">
                                                        @johndoes
                                                    </h2>
                                                </div>
                                                <div role="button" className={`h-9 duration-100 w-24 bg-white rounded-xl text-neutral-600 grid place-content-center text-sm font-semibold`}>
                                                    Follow
                                                </div>
                                            </div>
                                            <p className="text-neutral-300 whitespace-pre-line">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet molestias quibusdam esse rem, deleniti veniam reiciendis.
                                            </p>
                                        </div>

                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </section>

            <section className="mt-6 space-y-6">
                {
                    data?.pages.map((page) =>
                        page.items.map((item) => (
                            <Post data={item} key={`post-${item.publicId}`} />
                        ))
                    )
                }
                <InfiniteScrollSentinel fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} textForGuest="to view more posts." />
            </section>
        </div>
    )
}

export default Explore;