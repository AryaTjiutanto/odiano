import type { NotificationDTO } from "@connect/shared"
import { formatRelativeShort } from "../../../utils/dateFormater.util"
import Profile from "../../social/Profile"

type Props = {
    item: NotificationDTO
}

const CommentOnYourPostNotification = ({ item }: Props) => {
    return (
        <div className="w-full flex items-center space-x-3" key={`notification-${item.id}`}>
            <div className="w-12 h-12">
                <Profile data={item.actor.profileImage} />
            </div>

            <div className="flex-1 w-full flex space-x-2 space-y-2 flex-wrap">
                <p className="space-x-2 space-y-2">
                    <b className="font-bold">{item.actor.username}</b>
                    <span>Comment on your post.</span>
                    <span className="text-neutral-500">{formatRelativeShort(item.createdAt)}</span>
                </p>
            </div>
        </div>
    )
}

export default CommentOnYourPostNotification;