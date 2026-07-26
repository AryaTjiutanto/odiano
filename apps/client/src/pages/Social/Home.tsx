import Post from "../../components/post/Post";
import type { InfiniteQuery, PostDTO } from "@connect/shared";
import PostSkeletonLoading from "../../components/post/PostSkeletonLoading";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScrollSentinel from "../../components/common/InfiniteScrollSentinel";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { postKeys } from "../../queries/postKeys";
import { getPosts } from "../../services/post.service";
import HomeHeader from "../../components/social/HomeHeader";
import CreatePostFloatingButton from "../../components/social/CreatePostFloatingButton";

const Homepage = () => {
    const postsQueryKey = postKeys.all;

    const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryFn: ({pageParam}) => getPosts(pageParam),
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
            {/* head */}
            <title>Connect - Share Your Moments</title>
            <meta
                name="description"
                content="Connect with friends, share posts, and explore communities."
            />

            {/* create post button - mobile */}
            <CreatePostFloatingButton/>

            {/* body */}
            <div className="w-full flex flex-col">
                {/* header */}
                <HomeHeader/>

                {/* story */}
                {/* comming soon */}
                {/* <StoryList /> */}

                {/* posts */}
                <div className="mt-2 space-y-6 sm:pb-6">
                    {
                        isPending &&
                        Array.from({ length: 3 }).map((_, i) => <PostSkeletonLoading key={`post-skeleton-${i}`}/>)
                    }
                    {
                        data &&
                        <>
                            {
                                data?.pages.map((page) =>
                                    page.items.map((item) => (
                                        <Post data={item} key={`post-${item.publicId}`}/>
                                    ))
                                )
                            }
                            <InfiniteScrollSentinel fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
                        </>
                    }

                    {
                        (isDataEmpty && !isPending) &&
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
            </div>
        </>
    )
}

export default Homepage;