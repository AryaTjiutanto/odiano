import { OTP_CHANNELS, OTP_PURPOSES, OtpChannels, OtpPurposes } from "@connect/shared";
import { model, Schema } from "mongoose"
import bcrypt from "bcrypt"

type OtpSchema = {
    target : string,
    channel : OtpChannels,
    purpose : OtpPurposes,
    code : string,
    attempt : number,
    expiresAt : Date,
}

const otpSchema = new Schema<OtpSchema>({
    target : {
        required : true,
        type : String,
    },
    channel : {
        required : true,
        type : String,
        enum : Object.values(OTP_CHANNELS),
    },
    purpose : {
        required : true,
        type : String,
        enum : Object.values(OTP_PURPOSES),
    },
    code : {
        required : true,
        type : String
    },
    attempt : {
        required : true,
        type : Number
    },
    expiresAt : {
        required : true,
        type : Date,
        index : {expires : 0}
    }
})

otpSchema.pre("save", async function() {
    if(this.code) {
        this.code = await bcrypt.hash(this.code, 12);
    }
})

export const OTP = model("OTP", otpSchema);
export default OTP;