export const VERIFICATION_CHALLENGE_STATUS = {
    PENDING : "pending",
    VERIFIED : "verified",
    REVOKED : "revoked"
}

export const VERIFICATION_CHALLENGE_PURPOSE = {
    LOGIN : "login"
}


export type VerificationChallengePurpose = typeof VERIFICATION_CHALLENGE_PURPOSE[keyof typeof VERIFICATION_CHALLENGE_PURPOSE];
export type VerificationChallengeStatus = typeof VERIFICATION_CHALLENGE_STATUS[keyof typeof VERIFICATION_CHALLENGE_STATUS];