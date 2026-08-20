import type { InfiniteQueryNotificationDTO } from "../../types/notification.type"

export const markNotificationAsRead = (oldData: InfiniteQueryNotificationDTO, notificationId: string) => {
    return {
        ...oldData,
        pageParams: oldData.pageParams,
        pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map(item => {
                return item.id == notificationId ?
                    {
                        ...item,
                        isRead: true,
                    } : item
            })
        }))
    }
}

export const markNotificationAsUnread = (oldData: InfiniteQueryNotificationDTO, notificationId: string) => {
    return {
        ...oldData,
        pageParams: oldData.pageParams,
        pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map(item => {
                return item.id == notificationId ?
                    {
                        ...item,
                        isRead: false,
                    } : item
            })
        }))
    }
}

export const markAllUnreadNotificationCacheAsRead = (oldData: InfiniteQueryNotificationDTO) => {
    return {
        ...oldData,
        pageParams: oldData.pageParams,
        pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map(item => ({
                ...item,
                isRead: true,
            }))
        }))
    }
}

export const markAllUnreadNotificationCacheAsUnread = (oldData: InfiniteQueryNotificationDTO) => {
    return {
        ...oldData,
        pageParams: oldData.pageParams,
        pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map(item => ({
                ...item,
                isRead: false,
            }))
        }))
    }
}