import type { InfiniteData } from "@tanstack/react-query"
import CommentOnYourPostNotification from "./types/CommentOnYourPostNotification"
import { NOTIFICATION_TYPE, type InfiniteQuery, type NotificationDTO } from "@connect/shared"
import FollowYouNotification from "./types/FollowYouNotification"
import InfiniteScrollSentinel from "../common/InfiniteScrollSentinel"

type Props = {
    data: InfiniteData<InfiniteQuery<NotificationDTO[]>> | null | undefined,
    fetchNextPage: () => Promise<unknown>,
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    handleUpdateReadStatus: (item: NotificationDTO) => void,
}

const Notification = ({ data, fetchNextPage, hasNextPage, isFetchingNextPage, handleUpdateReadStatus }: Props) => {
    if (data && data.pages[0].items.length > 0) {
        return (
            <div className="w-full">
                <div className="w-full space-y-2">
                    {data.pages.map((page) => page.items.map(item => {
                        return (
                            <article className={`w-full ${!item.isRead && 'bg-neutral-900'} rounded-xl px-3 py-3 cursor-pointer`} onClick={() => handleUpdateReadStatus(item)}>
                                {
                                    (item.type == NOTIFICATION_TYPE.COMMENT_ON_YOUR_POST) &&
                                    <CommentOnYourPostNotification item={item} />
                                }
                                {
                                    item.type == NOTIFICATION_TYPE.FOLLOW_YOU &&
                                    <FollowYouNotification item={item} />
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

export default Notification