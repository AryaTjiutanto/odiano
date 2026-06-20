import CreateCommentSection from "./CreateCommentSection";
import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { type SuccessResponseData, type InfiniteQuery, type PostCommentDTO } from "@connect/shared";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { api } from "../../libs/api";
import CommentSkeletonLoading from "./CommentSkeletonLoading";
import { EllipsisVertical, Heart } from "lucide-react";
import { formatRelativeShort } from "../../utils/dateFormater.util";
import InfiniteScrollSentinel from "../common/InfiniteScrollSentinel";

type Props = {
    postId: string,
}

const CommentSection = ({ postId }: Props) => {
    const commentQueryKey = ["comment", postId];

    const getComments = async ({ pageParam }: QueryFunctionContext): Promise<InfiniteQuery<PostCommentDTO[]>> => {
        const response = await api.get<SuccessResponseData<InfiniteQuery<PostCommentDTO[]>>>("post/comment/get", {
            params: {
                postId,
                cursor: pageParam
            }
        })

        if(!response.data.data?.items) throw new Error("Data is empty")

        return response.data.data;
    }

    const commentQuery = useInfiniteQuery({
        queryFn: getComments,
        queryKey: commentQueryKey,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        getNextPageParam: (lastPage: InfiniteQuery<PostCommentDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        }
    });

    return (
        <>
            {/* create comment */}
            <CreateCommentSection postId={postId} />

            {/* comments */}
            <div className="w-full space-y-8 mt-10">
                {
                    commentQuery.isPending ?
                        <>
                            {
                                Array.from({length : 3}).map((item, index) => (
                                    <CommentSkeletonLoading key={`skeleton-comment-${index}`}/>
                                ))
                            }
                        </>
                        :
                        <>
                            {
                                commentQuery.data?.pages.map((page) => 
                                    page.items.map((item) => (
                                    <div className="w-full flex space-x-3">
                                        <div className="">
                                            <div className="w-12 aspect-square rounded-full bg-neutral-800">

                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="w-full flex items-center justify-between">
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <h1 className="font-bold">{item.author.name || ""}</h1>
                                                        <h2 className="text-neutral-500">@{item.author.username || ""}</h2>
                                                    </div>
                                                </div>
                                                <EllipsisVertical className="w-5" />
                                            </div>
                                            <p className="mt-1">
                                                {item.content || ""}
                                            </p>
                                            <div className="mt-2 flex items-center space-x-5 text-neutral-500">
                                                <span>
                                                    {formatRelativeShort(item.createdAt)}
                                                </span>
                                                <button className="text-sm flex items-center space-x-1 cursor-pointer">
                                                    <Heart className="w-4" />
                                                    <span>
                                                        5
                                                    </span>
                                                </button>
                                                <button className="cursor-pointer">
                                                    Replay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )))
                            }
                            <InfiniteScrollSentinel fetchNextPage={commentQuery.fetchNextPage} hasNextPage={commentQuery.hasNextPage} isFetchingNextPage={commentQuery.isFetchingNextPage}/>
                        </>
                }
            </div>
        </>
    )
}

export default CommentSection;