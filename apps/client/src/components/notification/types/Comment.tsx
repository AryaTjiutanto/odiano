import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, type NotificationDTO } from "@odiano/shared"
import { formatRelativeShort } from "../../../utils/dateFormater.util"
import Profile from "../../profile/Profile"
import { MessageCircle } from "lucide-react"
import NotificationMedia from "../NotificationMedia"

type Props = {
    item: NotificationDTO
}

const CommentNotification = ({ item }: Props) => {
    if (item.data.type !== NOTIFICATION_TYPE.COMMENT) return;

    const target = item.data.target;

    if (target.type == NOTIFICATION_TARGET_TYPE.POST) {
        return (
            <div className="w-full flex items-center space-x-3" key={`notification-${item.id}`}>
                <div className="relative">
                    <div className="w-12 h-12">
                        <Profile data={item.actor?.profileImage} />
                    </div>

                    <div className="absolute bottom-0 -right-1">
                        <MessageCircle className="text-white fill-white w-5" />
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col space-x-2 flex-wrap">
                    <p className="space-x-2 space-y-2">
                        <b className="font-bold">{item.actor?.username}</b>
                        <span>Comment on your post.</span>
                        <span className="text-neutral-500">{formatRelativeShort(item.createdAt)}</span>
                    </p>
                    {
                        target &&
                        <p className="max-w-[60%] truncate text-[15px] text-neutral-500">
                            {item.data.target.content}
                        </p>
                    }
                    {
                        item.data.comment &&
                        <p className="max-w-[45%] truncate text-base text-neutral-100 mt-0.5">
                            {item.data.comment.content}
                        </p>
                    }
                </div>

                <NotificationMedia mediaType={target?.firstMedia?.type} mediaUrl={target?.firstMedia?.url} mediaAspectRatio={target?.firstMedia?.aspectRatio} />
            </div>
        )
    }

}

export default CommentNotification;