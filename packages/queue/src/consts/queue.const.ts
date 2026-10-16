export const QUEUE_NAMES = {
    "EMAIL" : "email" as const,
    "MAINTENANCE" : "maintenance" as const
}

export type QueueNames = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];