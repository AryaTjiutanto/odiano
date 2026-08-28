import { type PostDTO, type UserSummaryDTO } from "@odiano/shared";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../profile/Profile";
import PostMenu from "../floating-menu/PostMenu";
import PostMedia from "./PostMedia";
import PostContent from "./PostContent";
import usePostHandler from "../../hooks/usePostHandler";

type Props = {
    data: PostDTO,
    author?: UserSummaryDTO,
    canDeletePost?: boolean,
}

const Post = ({ data, author, canDeletePost = false }: Props) => {
    const { handleLike } = usePostHandler(data.publicId);
    const navigate = useNavigate();

    const dataAuthor = data.author ?? author;

    return (
        <article onClick={() => navigate(`/${dataAuthor?.username}/post/${data.publicId}`)} className="inline-block w-full pb-6 sm:pb-7 sm:py-7 lg:py-10 first:pt-4 sm:rounded-lg cursor-pointer border-b last:border-0 border-neutral-900 relative overflow-hidden">
            <div className="flex items-center justify-between">
                <Link to={`/profile/${dataAuthor?.username}`} className="z-20">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 aspect-square">
                            <Profile data={dataAuthor?.profileImage} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                                <h1 className="text-neutral-100 font-semibold">{dataAuthor?.name ?? ""}</h1>
                                <h2 className="text-neutral-500">@{dataAuthor?.username ?? ""}</h2>
                            </div>
                            <h3 className="text-xs text-neutral-500">
                                {data.createdAt ? formatDistanceToNow(data.createdAt) : '-'}
                            </h3>
                        </div>
                    </div>
                </Link>

                <div onClick={(e) => e.stopPropagation()}>
                    <PostMenu authorUsername={author?.username} post={data} canDeletePost={canDeletePost} />
                </div>
            </div>
            <div className="w-full mt-8 space-y-5">
                <PostMedia media={data.media} />
                <PostContent content={data.content} />
            </div>
            <div className="mt-8 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 z-20 hover:text-sky-500 duration-100" onClick={(e) => e.preventDefault()}>
                        <MessageCircle className="w-4" />
                        <span>
                            {data.commentCount ?? 0}
                        </span>
                    </div>
                    <button className={`flex items-center space-x-1 z-20 ${data.isLiked ? 'text-rose-500' : 'hover:text-rose-500'} duration-100 cursor-pointer`} onClick={(e) => {
                        e.stopPropagation(); 
                        handleLike(data.isLiked, data.id, data.author?.username)
                    }}>
                        <Heart className={`w-4 ${data.isLiked && 'fill-rose-500'}`} />
                        <span>
                            {data.likeCount ?? 0}
                        </span>
                    </button>
                </div>

                {/* comming soon */}
                {/* <button>
                    <Bookmark className="w-4 cursor-pointer hover:text-sky-500 duration-100" onClick={(e) => e.preventDefault()} />
                </button> */}
            </div>
        </article>
    )
}

export default Post;