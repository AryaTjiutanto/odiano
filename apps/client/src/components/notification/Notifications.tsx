import { NOTIFICATION_TYPE, type NotificationDTO } from "@odiano/shared"
import InfiniteScrollSentinel from "../common/InfiniteScrollSentinel"
import type { InfiniteQueryNotificationDTO } from "../../types/notification.type"
import CommentNotification from "./types/Comment"
import FollowNotification from "./types/Follow"
import LikeNotification from "./types/Like"
import SuspendNotification from "./types/Suspend"
import ReportNotification from "./types/Report"

type Props = {
    data: InfiniteQueryNotificationDTO | null | undefined,
    fetchNextPage: () => Promise<unknown>,
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    handleUpdateReadStatus: (item: NotificationDTO) => void,
}

const Notifications = ({ data, fetchNextPage, hasNextPage, isFetchingNextPage, handleUpdateReadStatus }: Props) => {
    if (data && data.pages[0].items.length > 0) {
        return (
            <div className="w-full">
                <div className="w-full space-y-2">
                    {data.pages.map((page) => page.items.map(item => {
                        if(!item.data) return;

                        return (
                            <article className={`w-full ${!item.isRead && 'bg-[#141414]'} rounded-xl px-5 sm:px-3 py-3 cursor-pointer`} onClick={() => handleUpdateReadStatus(item)} key={`notification-${item.id}`}>
                                {
                                    (item.data.type == NOTIFICATION_TYPE.COMMENT) &&
                                    <CommentNotification item={item} />
                                }
                                {
                                    item.data.type == NOTIFICATION_TYPE.FOLLOW &&
                                    <FollowNotification item={item} />
                                }
                                {
                                    item.data.type == NOTIFICATION_TYPE.LIKE &&
                                    <LikeNotification item={item} />
                                }
                                {
                                    item.data.type == NOTIFICATION_TYPE.SUSPEND && 
                                    <SuspendNotification item={item}/>
                                }
                                {
                                    item.data.type == NOTIFICATION_TYPE.REPORT && 
                                    <ReportNotification item={item}/>
                                }
                            </article>
                        )
                    }
                    ))}
                </div>

                <InfiniteScrollSentinel fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
            </div>
        )
    }

    return <></>
}

export default Notifications