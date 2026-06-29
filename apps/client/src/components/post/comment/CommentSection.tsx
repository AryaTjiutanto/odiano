import { useInfiniteQuery, useMutation, useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { type SuccessResponseData, type InfiniteQuery, type PostCommentDTO } from "@connect/shared";
import { DEFAULT_GC_TIME } from "../../../consts/queryTime.const";
import { api } from "../../../libs/api";
import CommentSkeletonLoading from "./CommentSkeletonLoading";
import InfiniteScrollSentinel from "../../common/InfiniteScrollSentinel";
import CreateCommentSection from "./CreateCommentSection";
import Comment from "./Comment";

type Props = {
    postId: string,
}

const CommentSection = ({ postId }: Props) => {
    // current user comment
    const currentUserQueryKey = ["comment", postId, "currentUser"];

    const getCurrentUserComments = async () => {
        const response = await api.get<SuccessResponseData<PostCommentDTO[]>>(`post/${postId}/comments/me`);

        return response.data.data;
    }

    const currentUserCommentQuery = useQuery({
        queryKey : currentUserQueryKey,
        queryFn : getCurrentUserComments,
        staleTime : 30 * 1000,
        gcTime : DEFAULT_GC_TIME,
    })

    // comments
    const commentQueryKey = ["comment", postId];

    const getComments = async ({ pageParam }: QueryFunctionContext): Promise<InfiniteQuery<PostCommentDTO[]>> => {
        const response = await api.get<SuccessResponseData<InfiniteQuery<PostCommentDTO[]>>>(`post/${postId}/comments`, {
            params: {
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
            <CreateCommentSection postId={postId} queryKey={currentUserQueryKey}/>

            {/* comments */}
            <div className="w-full space-y-8 mt-10">
                {
                    (commentQuery.isPending || currentUserCommentQuery.isPending) ?
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
                                currentUserCommentQuery.data?.map(data => <Comment data={data}/>)
                            }
                            {
                                commentQuery.data?.pages.map((page) => 
                                    page.items.map((item) => (
                                    <Comment data={item}/>
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