import type { PostDTO } from "@connect/shared";
import { Bookmark, EllipsisVertical, Heart, MessageCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Props = {
    data : PostDTO
}

const Post = ({data} : Props) => {
    return (
        <article className="w-full p-7 rounded-lg bg-neutral-900">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-10 aspect-square rounded-full bg-neutral-800 grid place-content-center overflow-hidden">
                        {
                            data.author?.profileImage?.url ?
                            <img src={data.author.profileImage.url} className="w-full h-full"/>
                            :
                            <User className="w-4"/>
                        }
                    </div>
                    <div>
                        <div className="flex items-center space-x-2 text-xs">
                            <h1 className="text-neutral-100 font-semibold">{data.author?.name ?? ""}</h1>
                            <h2 className="text-neutral-500">@{data.author?.username ?? ""}</h2>
                        </div>
                        <h3 className="text-[11px] text-neutral-500">
                            { data.createdAt ? formatDistanceToNow(data.createdAt) : '-'}
                        </h3>
                    </div>
                </div>
                <EllipsisVertical className="w-4" />
            </div>
            <p className="text-sm mt-8">
                {data.content ?? ""}
            </p>
            <div className="mt-8 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4" />
                        <span>
                            0
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Heart className="w-4" />
                        <span>
                            0
                        </span>
                    </div>
                </div>
                <button>
                    <Bookmark className="w-4"/>
                </button>
            </div>
        </article>
    )
}

export default Post;