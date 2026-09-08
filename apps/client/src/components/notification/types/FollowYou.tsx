import { NOTIFICATION_TYPE, type NotificationDTO } from "@odiano/shared";
import { formatRelativeShort } from "../../../utils/dateFormater.util";
import Profile from "../../profile/Profile";
import { User } from "lucide-react";

type Props = {
    item: NotificationDTO
}

const FollowYou = ({ item }: Props) => {
    if(item.data.type !== NOTIFICATION_TYPE.FOLLOW_YOU) return;

    return (
        <div className={`w-full flex items-center space-x-3`} key={`notification-${item.id}`}>
            <div className="relative">
                <div className="w-12 aspect-square">
                    <Profile data={item.data.actor.profileImage} />
                </div>

                <div className="absolute bottom-0 -right-1">
                    <User className="text-sky-500 fill-sky-500 w-5"/>
                </div>
            </div>

            <div className="flex-1 w-full flex space-x-2 space-y-2 flex-wrap">
                <p className="space-x-2 space-y-2">
                    <b className="font-bold">{item.data.actor.username}</b>
                    <span>Start following you</span>
                    <span className="text-neutral-500">{formatRelativeShort(item.createdAt)}</span>
                </p>
            </div>
        </div>

    )
}

export default FollowYou;