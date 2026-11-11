import { Types, Schema, model } from "mongoose"
import { VERIFICATION_CHALLENGE_PURPOSE, VERIFICATION_CHALLENGE_STATUS, VerificationChallengePurpose, VerificationChallengeStatus } from "../consts/verificationChallenge.const.js"

type VerificationChallengeSchema = {
    purpose : VerificationChallengePurpose,
    user : Types.ObjectId,
    status : VerificationChallengeStatus,
    expireAt : Date,
}

const verificationChallengeSchema = new Schema<VerificationChallengeSchema>({
    expireAt : {
        type : Date,
        required : true,
        index : {
            expireAfterSeconds : 0,
        }
    },
    status : {
        type : String,
        enum : Object.values(VERIFICATION_CHALLENGE_STATUS),
        required : true,
    },
    purpose : {
        type : String,
        enum : Object.values(VERIFICATION_CHALLENGE_PURPOSE),
        required : true,
    },
    user : {
        type : Types.ObjectId,
        ref : "User",
        required : true,
    }
});

const VerificationChallenge = model("VerificationChallenge", verificationChallengeSchema);
export default VerificationChallenge;