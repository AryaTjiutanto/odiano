import { ALLOWED_MEDIA_TYPES, type NotificationDTO } from "@odiano/shared";
import { formatRelativeShort } from "../../../utils/dateFormater.util";
import Profile from "../../profile/Profile";
import { Heart } from "lucide-react";
import NotificationMedia from "../NotificationMedia";

type Props = {
    item: NotificationDTO
}

const LikeYourPost = ({ item }: Props) => {
    return (
        <div className={`w-full flex items-center space-x-3`} key={`notification-${item.id}`}>
            <div className="relative">
                <div className="w-12 aspect-square">
                    <Profile data={item.actor.profileImage} />
                </div>

                <div className="absolute bottom-0 -right-1">
                    <Heart className="text-rose-500 fill-rose-500 w-5" />
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col space-x-2 flex-wrap">
                <p className="space-x-2 space-y-2">
                    <b className="font-bold">{item.actor.username}</b>
                    <span className="text-neutral-300">Liked your Post</span>
                    <span className="text-neutral-500">{formatRelativeShort(item.createdAt)}</span>
                </p>
                {
                    item.data?.post &&
                    <p className="text-[15px] max-w-[60%] truncate text-neutral-500">
                        {item.data.post.content}
                    </p>
                }
            </div>

            <NotificationMedia mediaType={item.data?.post?.firstMedia?.type} mediaUrl={item.data?.post?.firstMedia?.url} mediaAspectRatio={item.data?.post?.firstMedia?.aspectRatio} />
        </div>
    )
}

export default LikeYourPost;