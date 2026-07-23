export const OTP_CHANNELS = {
    EMAIL : "email" as const,
    PHONE : "phone" as const,
}

export const OTP_PURPOSES = {
    "VERIFY_EMAIL" : "verify email" as const
}

export const DEFAULT_OTP_EXPIRES_TIME = 1 * 60 * 60 * 1000;

export type OtpChannels = typeof OTP_CHANNELS[keyof typeof OTP_CHANNELS];
export type OtpPurposes = typeof OTP_PURPOSES[keyof typeof OTP_PURPOSES];