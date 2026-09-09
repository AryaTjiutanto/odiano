import CommentOnYourPost from "./types/CommentOnYourPost"
import { NOTIFICATION_TYPE, type NotificationDTO } from "@odiano/shared"
import FollowYou from "./types/FollowYou"
import InfiniteScrollSentinel from "../common/InfiniteScrollSentinel"
import LikeYourPost from "./types/LikeYourPost"
import type { InfiniteQueryNotificationDTO } from "../../types/notification.type"
import YourPostSuspended from "./types/YourPostSuspended"
import YourReportResolved from "./types/YourReportResolved"

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
                        return (
                            <article className={`w-full ${!item.isRead && 'bg-[#141414]'} rounded-xl px-5 sm:px-3 py-3 cursor-pointer`} onClick={() => handleUpdateReadStatus(item)}>
                                {
                                    (item.data.type == NOTIFICATION_TYPE.COMMENT_ON_YOUR_POST) &&
                                    <CommentOnYourPost item={item} />
                                }
                                {
                                    item.data.type == NOTIFICATION_TYPE.FOLLOW_YOU &&
                                    <FollowYou item={item} />
                                }
                                {
                                    item.data.type == NOTIFICATION_TYPE.LIKE_YOUR_POST &&
                                    <LikeYourPost item={item} />
                                }
                                {
                                    item.data.type == NOTIFICATION_TYPE.YOUR_POST_SUSPENDED && 
                                    <YourPostSuspended item={item}/>
                                }
                                {
                                    item.data.type == NOTIFICATION_TYPE.YOUR_REPORT_RESOLVED && 
                                    <YourReportResolved item={item}/>
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