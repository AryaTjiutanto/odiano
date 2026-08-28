export const ACTIONS = {
    CREATE : "create",
    READ : "read",
    UPDATE : "update",
    DELETE : "delete",
} as const;

export type Action = typeof ACTIONS[keyof typeof ACTIONS]