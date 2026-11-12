import { VERIFICATION_CHALLENGE_PURPOSE, VERIFICATION_CHALLENGE_STATUS } from "../consts/verificationChallenge.const.js";
import { generateRequestVerificationToken } from "../libs/request-verification/verification.token.js";
import VerificationChallenge from "../models/verificationChallenge.model.js";
import addTimeToCurrentDate from "../utils/addTimeToCurrentDate.js";

export const createRequestVerificationToken = async (userId : string) : Promise<{
    challengeId : string,
    requestVerificationToken : string,
}> => {
    const challenge = await VerificationChallenge.create({
        user : userId,
        expireAt : addTimeToCurrentDate(1 * 60 * 60 * 1000),
        purpose : VERIFICATION_CHALLENGE_PURPOSE.LOGIN,
        status : VERIFICATION_CHALLENGE_STATUS.PENDING,
    })

    const token =  generateRequestVerificationToken({
        expireAt : addTimeToCurrentDate(10 * 60 * 1000),
        verificationChallengeId : challenge._id.toString(),
    });

    return {
        challengeId : challenge._id.toString(),
        requestVerificationToken : token
    }
}