export const SUBJECTS = {
    USER : "user",
    POST : "post",
    COMMENT : "comment",
    NOTIFICATION : "notification",
    SEARCH : "search",
    SEARCH_HISTORY : "searchHistory",
} as const

export type Subject = typeof SUBJECTS[keyof typeof SUBJECTS]