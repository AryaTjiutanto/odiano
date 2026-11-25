import { AuthToken } from "@odiano/shared"

// sign in  result
type RequireVerificationData = {
    requireVerification : true,
    requestVerificationToken : string,
    verificationChallengeId : string,
}

export type SigninResult = RequireVerificationData | {
    requireVerification : false,
    token : AuthToken,
}