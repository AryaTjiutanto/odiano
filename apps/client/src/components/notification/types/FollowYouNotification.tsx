import type { NotificationDTO } from "@odiano/shared";
import { formatRelativeShort } from "../../../utils/dateFormater.util";
import Profile from "../../profile/Profile";

type Props = {
    item: NotificationDTO
}

const FollowYouNotification = ({ item }: Props) => {
    return (
        <div className={`w-full flex items-center space-x-3`} key={`notification-${item.id}`}>
            <div className="w-12 aspect-square">
                <Profile data={item.actor.profileImage} />
            </div>

            <div className="flex-1 w-full flex space-x-2 space-y-2 flex-wrap">
                <p className="space-x-2 space-y-2">
                    <b className="font-bold">{item.actor.username}</b>
                    <span>Start following you</span>
                    <span className="text-neutral-500">{formatRelativeShort(item.createdAt)}</span>
                </p>
            </div>

            <button className="w-28 h-10 bg-blue-500 text-white text-sm border border-blue-500 hover:bg-transparent duration-100 cursor-pointer rounded-lg">
                Follow back
            </button>
        </div>

    )
}

export default FollowYouNotification;