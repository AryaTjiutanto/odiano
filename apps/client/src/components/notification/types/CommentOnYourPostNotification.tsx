import { NOTIFICATION_TYPE, type NotificationDTO } from "@odiano/shared"
import { formatRelativeShort } from "../../../utils/dateFormater.util"
import Profile from "../../profile/Profile"
import { MessageCircle } from "lucide-react"
import NotificationMedia from "../NotificationMedia"

type Props = {
    item: NotificationDTO
}

const CommentOnYourPostNotification = ({ item }: Props) => {
    if(item.data.type !==  NOTIFICATION_TYPE.COMMENT_ON_YOUR_POST) return;

    return (
        <div className="w-full flex items-center space-x-3" key={`notification-${item.id}`}>
            <div className="relative">
                <div className="w-12 h-12">
                    <Profile data={item.data.actor.profileImage} />
                </div>

                <div className="absolute bottom-0 -right-1">
                    <MessageCircle className="text-white fill-white w-5" />
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col space-x-2 flex-wrap">
                <p className="space-x-2 space-y-2">
                    <b className="font-bold">{item.data.actor.username}</b>
                    <span>Comment on your post.</span>
                    <span className="text-neutral-500">{formatRelativeShort(item.createdAt)}</span>
                </p>
                {
                    item.data?.target.post &&
                    <p className="max-w-[60%] truncate text-[15px] text-neutral-500">
                        {item.data.target.post.content}
                    </p>
                }
                {
                    item.data?.target.comment &&
                    <p className="max-w-[45%] truncate text-base text-neutral-100 mt-0.5">
                        {item.data.target.comment.content}
                    </p>
                }
            </div>

            <NotificationMedia mediaType={item.data?.target.post?.firstMedia?.type} mediaUrl={item.data?.target.post?.firstMedia?.url} mediaAspectRatio={item.data?.target.post?.firstMedia?.aspectRatio} />
        </div>
    )
}

export default CommentOnYourPostNotification;