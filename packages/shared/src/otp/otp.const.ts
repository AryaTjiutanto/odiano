export const OTP_CHANNELS = {
    EMAIL : "email" as const,
    PHONE : "phone" as const,
}

export const OTP_PURPOSES = {
    "VERIFY_EMAIL" : "verify email" as const
}

export type OtpChannels = typeof OTP_CHANNELS[keyof typeof OTP_CHANNELS];
export type OtpPurposes = typeof OTP_PURPOSES[keyof typeof OTP_PURPOSES];