import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { type InfiniteQuery, type PostCommentDTO } from "@odiano/shared";
import { DEFAULT_GC_TIME } from "../../../consts/queryTime.const";
import CommentSkeletonLoading from "./CommentSkeletonLoading";
import InfiniteScrollSentinel from "../../common/InfiniteScrollSentinel";
import CreateCommentSection from "./CreateCommentSection";
import Comment from "./Comment";
import { useAppSelector } from "../../../hooks/useRedux";
import { postKeys } from "../../../queries/postKeys";
import { useSearchParams } from "react-router-dom";
import { getComment, getComments, getCurrentUserComments } from "../../../services/postComment.service";
import { useLayoutEffect, useRef } from "react";

type Props = {
    postId: string,
    shouldGettingComments?: boolean,
}

const CommentSection = ({ postId, shouldGettingComments = true }: Props) => {
    const [searchParams] = useSearchParams();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    // get hightlight comment
    const hightlightedCommentId = searchParams.get("commentId");
    const hightlightedCommentQuery = useQuery({
        queryKey: postKeys.comment(hightlightedCommentId!),
        queryFn: () => getComment(hightlightedCommentId!, postId),
        enabled: (!!hightlightedCommentId && shouldGettingComments),
        staleTime: 10 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialData: null,
    });

    // current user comment
    const currentUserQueryKey = postKeys.currentUserComments(postId);

    const currentUserCommentQuery = useQuery({
        queryKey: currentUserQueryKey,
        queryFn: () => getCurrentUserComments(postId),
        initialData: [],
        staleTime: 30 * 1000,
        enabled: (isAuthenticated && shouldGettingComments),
        gcTime: DEFAULT_GC_TIME,
    })

    // comments
    const commentQueryKey = postKeys.comments(postId, hightlightedCommentId);

    const commentQuery = useInfiniteQuery({
        queryFn: ({ pageParam }) => getComments(postId, pageParam, hightlightedCommentId),
        queryKey: commentQueryKey,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        enabled: (shouldGettingComments),
        getNextPageParam: (lastPage: InfiniteQuery<PostCommentDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        }
    });

    // handle hightlight comment
    const highlightedCommentRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (!hightlightedCommentId || !hightlightedCommentQuery.data) return;

        highlightedCommentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

    }, [hightlightedCommentId, hightlightedCommentQuery.data])


    return (
        <>
            {/* create comment */}
            <CreateCommentSection postId={postId} />

            {/* comments */}
            <div className="w-full space-y-8 mt-10 pb-6">
                {
                    ((commentQuery.isPending || (isAuthenticated && currentUserCommentQuery.isPending)) && shouldGettingComments) ?
                        <>
                            {
                                Array.from({ length: 3 }).map((_item, index) => (
                                    <CommentSkeletonLoading key={`skeleton-comment-${index}`} />
                                ))
                            }
                        </>
                        :
                        <>
                            {/* hightlight comment */}
                            {
                                hightlightedCommentQuery.data &&
                                <div className="w-full" ref={highlightedCommentRef}>
                                    <Comment data={hightlightedCommentQuery.data} postId={postId} isHightlighted={true}/>
                                </div>
                            }

                            {/* current user comments */}
                            {
                                currentUserCommentQuery.data?.map(data => <Comment data={data} postId={postId} />)
                            }

                            {/* comments */}
                            {
                                commentQuery.data?.pages.map((page) =>
                                    page.items.map((item) => (
                                        <Comment data={item} postId={postId} key={`comment-${item.id}`} />
                                    )))
                            }

                            {/* sentinel */}
                            <InfiniteScrollSentinel fetchNextPage={commentQuery.fetchNextPage} hasNextPage={commentQuery.hasNextPage} isFetchingNextPage={commentQuery.isFetchingNextPage} textForGuest="to view more comments." />
                        </>
                }
            </div>
        </>
    )
}

export default CommentSection;