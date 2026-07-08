export const SEARCH_TYPES = {
    USER : "user",
    TAG : "tag",
} as const;

export type SearchTypes = typeof SEARCH_TYPES[keyof typeof SEARCH_TYPES];