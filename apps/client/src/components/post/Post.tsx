import type { PostDTO, PostUserDTO } from "@connect/shared";
import { Bookmark, EllipsisVertical, Heart, MessageCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

type Props = {
    data: PostDTO,
    author? : PostUserDTO
}

const Post = ({ data, author }: Props) => {
    const dataAuthor = data.author ?? author;

    return (
        <Link to={`/${dataAuthor?.username}/post/${data.publicId}`} className="inline-block w-full">
            <article className="w-full p-7 rounded-lg bg-neutral-900">
                <div className="flex items-center justify-between">
                    <Link to={`/profile/${dataAuthor?.username}`} className="z-20">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 aspect-square rounded-full bg-neutral-800 grid place-content-center overflow-hidden">
                                {
                                    dataAuthor?.profileImage?.url ?
                                        <img src={dataAuthor.profileImage.url} className="w-full h-full" />
                                        :
                                        <User className="w-4" />
                                }
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 text-xs">
                                    <h1 className="text-neutral-100 font-semibold">{dataAuthor?.name ?? ""}</h1>
                                    <h2 className="text-neutral-500">@{dataAuthor?.username ?? ""}</h2>
                                </div>
                                <h3 className="text-[11px] text-neutral-500">
                                    {data.createdAt ? formatDistanceToNow(data.createdAt) : '-'}
                                </h3>
                            </div>
                        </div>
                    </Link>
                    <EllipsisVertical className="w-4" />
                </div>
                <p className="text-sm mt-8">
                    {data.content ?? ""}
                </p>
                <div className="mt-8 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 z-20 hover:text-sky-500 duration-100" onClick={(e) => e.preventDefault()}>
                            <MessageCircle className="w-4" />
                            <span>
                                0
                            </span>
                        </div>
                        <div className="flex items-center space-x-1 z-20 hover:text-rose-500 duration-100" onClick={(e) => e.preventDefault()}>
                            <Heart className="w-4" />
                            <span>
                                0
                            </span>
                        </div>
                    </div>
                    <button>
                        <Bookmark className="w-4 cursor-pointer hover:text-sky-500 duration-100" onClick={(e) => e.preventDefault()}/>
                    </button>
                </div>
            </article>
        </Link>
    )
}

export default Post;