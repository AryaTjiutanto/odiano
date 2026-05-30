import { Search } from "lucide-react";
import StoryList from "../components/social/StoryList";
import Post from "../components/post/Post";
import type { InfiniteQuery, PostDTO, SuccessResponseData } from "@connect/shared";
import PostSkeletonLoading from "../components/post/PostSkeletonLoading";
import { api } from "../libs/api";
import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import InfiniteScrollSentinel from "../components/common/InfiniteScrollSentinel";

const Homepage = () => {
    async function getPosts({pageParam} : QueryFunctionContext): Promise<InfiniteQuery<PostDTO[]>> {
        const response = await api.get<SuccessResponseData<InfiniteQuery<PostDTO[]>>>("/post", {
            params : {
                cursor : pageParam,
            }
        });

        if (!response.data.data) {
            throw new Error("Data is null");
        }

        return response.data.data;
    }

    const { data, isFetching, isFetchingNextPage, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryFn: getPosts,
        queryKey: ["post"],
        staleTime: 30 * 1000,
        gcTime: 1 * 60 * 60 * 1000,
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<PostDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        }
    })

    return (
        <>
            {/* head */}
            <title>Connect - Share Your Moments</title>
            <meta
                name="description"
                content="Connect with friends, share posts, and explore communities."
            />

            {/* body */}
            <div className="w-full">
                {/* heading */}
                <div className="w-full flex justify-between items-center">
                    {/* search bar */}
                    <div className="w-64 h-11 rounded-lg bg-neutral-900 border border-neutral-700 grid grid-cols-12 pr-2">
                        <div className="col-span-2 h-full grid place-content-center text-neutral-300">
                            <Search className="w-4" />
                        </div>
                        <input className="col-span-10 h-full default-input-text-behaviour" placeholder="Search..." />
                    </div>

                    {/* filter */}
                    <div className="w-fit flex items-center space-x-4">
                        <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-500">
                            Following
                        </button>
                        <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-100">
                            My Feed
                        </button>
                        <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-500">
                            Popular
                        </button>
                    </div>
                </div>
                {/* story */}
                <StoryList />

                {/* posts */}
                <div className="mt-8 space-y-6">
                    {
                        isFetching &&
                        Array.from({ length: 3 }).map(() => <PostSkeletonLoading />)
                    }
                    {
                        (status !== "error") &&
                        <>
                            {
                                data?.pages.map((page) =>
                                    page.items.map((item) => (
                                        <Post data={item} />
                                    ))
                                )
                            }
                            <InfiniteScrollSentinel fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}/>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Homepage;