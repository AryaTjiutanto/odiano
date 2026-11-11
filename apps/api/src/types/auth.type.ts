import { AuthToken } from "@odiano/shared"

// sign in  result
type RequireVerificationData = {
    requireVerification : true,
    requestVerificationToken : string,
}

export type SigninResult = RequireVerificationData | {
    requireVerification : false,
    token : AuthToken,
}