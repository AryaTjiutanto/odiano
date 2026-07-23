export const AUTH_CACHE_KEYS = {
    SIGNIN_ATTEMPT : (ip : string) => `auth:signin:attempt:ip:${ip}`,
    EMAIL_SIGNIN_ATTEMPT : (email : string, ip : string) => `auth:signin:attempt:email:${email}:ip:${ip}`,

    SIGNUP_COUNT : (ip : string) => `auth:signup:count:ip:${ip}`,

    SEND_OTP : (target : string) => `auth:send-email-verification:${target}`,
    VERIFY_EMAIL : (email : string) => `auth:verify-email:${email}`,
} as const;