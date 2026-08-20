import type { InfiniteQuery, NotificationDTO } from "@odiano/shared";
import type { InfiniteData } from "@tanstack/react-query";

export type InfiniteQueryNotificationDTO = InfiniteData<InfiniteQuery<NotificationDTO[]>>;