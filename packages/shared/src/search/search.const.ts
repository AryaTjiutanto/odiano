export const SEARCH_TYPES = {
    USER : "user",
    HASHTAG : "hashtag",
    TOPIC : "topic",
} as const;

export type SearchTypes = typeof SEARCH_TYPES[keyof typeof SEARCH_TYPES];