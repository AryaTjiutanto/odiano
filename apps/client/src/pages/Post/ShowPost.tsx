import { Heart, MessageCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PostDetailSkeletonLoading from "../../components/post/PostDetailSkeletonLoading";
import ErrorState from "../../components/common/ErrorState";
import GoBackIconButton from "../../components/common/GoBackIconButton";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import DotsLoader from "../../components/loader/DotsLoader";
import { getIsFollowingInformation } from "../../services/following.service";
import CommentSection from "../../components/post/comment/CommentSection";
import Profile from "../../components/profile/Profile";
import { useAppSelector } from "../../hooks/useRedux";
import { postKeys } from "../../queries/postKeys";
import NotFound from "../../components/error/NotFound";
import { userKeys } from "../../queries/userKeys";
import FollowingButton from "../../components/social/FollowingButton";
import PostMedia from "../../components/post/PostMedia";
import PostContent from "../../components/post/PostContent";
import usePostHandler from "../../hooks/usePostHandler";
import { getPost } from "../../services/post.service";
import PostMenu from "../../components/floating-menu/PostMenu";
import SEO from "../../components/seo/SEO";

const ShowPost = () => {
    const navigate = useNavigate();

    const { username, postPublicId } = useParams();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const currentUserId = useAppSelector((state) => state.auth.user?.id);

    // get post data
    const { handleLike } = usePostHandler(postPublicId!);

    const postQuery = useQuery({
        queryKey: postKeys.detail(postPublicId!),
        queryFn: () => getPost(postPublicId!),
        enabled: !!postPublicId,
        staleTime: 10 * 1000,
        initialData: undefined,
        gcTime: DEFAULT_GC_TIME,
    })

    useEffect(() => {
        if (!postPublicId) {
            navigate("/");
        }
    }, [postPublicId, navigate])

    // get is following handler
    const isFollowingQueryKey = userKeys.isFollowing(postQuery.data?.author?.username || "");

    const isFollowingQuery = useQuery({
        queryFn: async () => await getIsFollowingInformation(postQuery.data?.author?.id),
        queryKey: isFollowingQueryKey,
        enabled: (!!postQuery.data && isAuthenticated && currentUserId !== postQuery.data.author?.id),
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
    });

    // display
    return (
        <>
            <SEO title={`${postQuery.data?.author?.name ?? ""} on Odiano : "${postQuery.data?.content ?? ""}"`} withTitleSuffix={false} />

            {
                postQuery.isPending &&
                <PostDetailSkeletonLoading />
            }
            {
                postQuery.data == null &&
                <NotFound />
            }
            {
                postQuery.isError &&
                <div className="w-full h-full grid place-content-center">
                    <ErrorState
                        title="This post isn't available"
                        description="The post may have been deleted or the link is no longer valid."
                        fontSize="small"
                    />
                </div>
            }
            {
                postQuery.data &&
                <div className="w-full h-full relative main-section-padding-top">
                    <div>
                        <div className="flex items-center space-x-5">
                            <GoBackIconButton />
                            <h1 className="text-xl font-bold">
                                Post
                            </h1>
                        </div>
                    </div>

                    {/* post detail */}
                    <div className="w-full">
                        {/* profile */}
                        <div className="w-full flex items-center justify-between mt-8">
                            <Link to={`/profile/${username}`}>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 aspect-square">
                                        <Profile data={postQuery?.data?.author?.profileImage} />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 text-base">
                                            <h1 className="text-neutral-100 font-semibold">{postQuery.data?.author?.name ?? ""}</h1>
                                        </div>
                                        <div className="text-sm text-neutral-500">
                                            <h2 className="text-neutral-500">@{postQuery.data?.author?.username ?? ""}</h2>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className="flex items-center space-x-3">
                                {
                                    currentUserId !== postQuery.data?.author?.id &&
                                    <>
                                        {
                                            (isFollowingQuery.isPending && isAuthenticated) ?
                                                <div className="w-20 h-10 rounded-lg bg-neutral-100 grid place-content-center text-neutral-900">
                                                    <DotsLoader />
                                                </div>
                                                :
                                                (currentUserId != postQuery.data?.author?.id) &&
                                                <div role="button" className={`h-10 duration-100 ${isFollowingQuery.data?.isFollowing ? "w-28" : "w-20"}`}>
                                                    <FollowingButton targetUserId={postQuery.data?.author?.id} isFollowing={isFollowingQuery.data?.isFollowing} targetUsername={postQuery.data.author?.username} />
                                                </div>
                                        }
                                    </>
                                }

                                {/* comming soon */}
                                <PostMenu authorId={postQuery.data?.author?.id} post={postQuery.data} />
                            </div>
                        </div>
                        {/* content */}
                        <div className="mt-6 gap-5">
                            <PostMedia media={postQuery.data?.media} />
                            <div className="mt-4">
                                <PostContent content={postQuery.data?.content ?? ""} />
                            </div>
                        </div>

                        {/* Post information */}
                        <div className="flex items-center space-x-3 text-neutral-500 mt-4">
                            <div>
                                7:56 PM
                            </div>
                            <div className="w-1 aspect-square rounded-full bg-neutral-700"></div>
                            <div>
                                May 29, 2026
                            </div>

                            {/* <div className="w-1 aspect-square rounded-full bg-neutral-700"></div>
                    <div>
                        <b className="text-neutral-300">40</b> Views
                    </div> */}
                        </div>

                        <div className="flex items-center justify-between mt-10">
                            <div className="flex items-center space-x-10">
                                <button className={`flex items-center space-x-2 cursor-pointer ${postQuery?.data?.isLiked && "text-rose-500"}`} onClick={() => handleLike(postQuery.data?.isLiked, postQuery.data?.id, postQuery.data?.author?.username)}>
                                    <Heart className={`${postQuery?.data?.isLiked && "fill-rose-500"}`} />
                                    <p>
                                        {postQuery.data?.likeCount ?? 0}
                                    </p>
                                </button>
                                <div className="flex items-center space-x-2">
                                    <MessageCircle />
                                    <p>
                                        {postQuery.data?.commentCount ?? 0}
                                    </p>
                                </div>

                                {/* comming soon */}
                                {/* <button className="cursor-pointer">
                                    <Send />
                                </button> */}
                            </div>

                            {/* comming soon */}
                            {/* <button className="cursor-pointer">
                                <Bookmark />
                            </button> */}
                        </div>
                    </div>

                    {/* comment */}
                    {postQuery.data?.id &&
                        <CommentSection postId={postQuery.data.id} shouldGettingComments={postQuery.data.commentCount > 0} />
                    }
                </div>
            }
        </>
    )
}

export default ShowPost;