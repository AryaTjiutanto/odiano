import { EllipsisVertical, Heart } from "lucide-react";
import { formatRelativeShort } from "../../../utils/dateFormater.util";
import type { PostCommentDTO } from "@connect/shared";
import Profile from "../../social/Profile";

type Props = {
    data: PostCommentDTO,
}

const Comment = ({ data }: Props) => {
    return (
        <div className="w-full flex space-x-3">
            <div className="w-12 h-12">
                <Profile data={data?.author.profileImage} />
            </div>
            <div className="w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                            <h1 className="font-bold">{data.author.name || ""}</h1>
                            <h2 className="text-neutral-500">@{data.author.username || ""}</h2>
                        </div>
                    </div>
                    <EllipsisVertical className="w-5" />
                </div>
                <p className="mt-1">
                    {data.content || ""}
                </p>
                {
                    ("isPosted" in data && data.isPosted == false) ?
                        <div className="text-xs text-neutral-500 mt-2">
                            Loading...
                        </div>
                        :
                        <div className="mt-2 flex items-center space-x-5 text-neutral-500">
                            <span>
                                {formatRelativeShort(data.createdAt)}
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
                }
            </div>
        </div>
    )
}

export default Comment;