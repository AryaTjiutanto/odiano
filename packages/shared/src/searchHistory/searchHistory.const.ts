export const SEARCH_HISTORY_TYPES = {
    USER : "user",
    TAG : "tag",
} as const;

export type SearchHistoryTypes = typeof SEARCH_HISTORY_TYPES[keyof typeof SEARCH_HISTORY_TYPES];