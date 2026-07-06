export const SEARCH_HISTORY_TYPES = {
    POST : "Post"
} as const;

export type SearchHistoryTypes = typeof SEARCH_HISTORY_TYPES[keyof typeof SEARCH_HISTORY_TYPES];