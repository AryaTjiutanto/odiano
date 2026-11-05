import { SESSION_STATUS, SessionStatus } from "@odiano/shared";
import { model, Schema, Types } from "mongoose";

type DeviceSchema = {
    deviceId : string,
    userAgent: string | null,
}

type SessionSchema = {
    device: DeviceSchema,
    userId: Types.ObjectId,
    lastLogin: Date,
    status : SessionStatus
}

const deviceSchema = new Schema<DeviceSchema>({
    userAgent : {
        type : String,
        required : false,
        default : null
    },
    deviceId : {
        type : String,
        required : true,
    }
})

const sessionSchema = new Schema<SessionSchema>({
    device : deviceSchema,
    userId : {
        type : Types.ObjectId,
        ref : "User",
        required : true,
    },
    lastLogin : {
        type : Date,
        required : true,
    },
    status : {
        type : String,
        enum : Object.values(SESSION_STATUS),
        default : SESSION_STATUS.ACTIVE,
        required : true,
    }
}, {timestamps : true});


export const Session = model("Session", sessionSchema);