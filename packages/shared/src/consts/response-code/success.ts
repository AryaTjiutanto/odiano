export const SUCCESS_RESPONSE_CODE = {
    ok: "OK",
    success: "SUCCESS",
    created: "CREATED",
} as const;

export type SuccessResponseCode = typeof SUCCESS_RESPONSE_CODE[keyof typeof SUCCESS_RESPONSE_CODE];