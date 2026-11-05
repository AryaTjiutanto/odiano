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
    status : SessionStatus,
    expire_at : Date | null,
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
        index : 1,
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
    },
    expire_at : {
        type : Date,
        default : null,
        required : false,
        index : {
            expireAfterSeconds : 0
        }
    }
}, {timestamps : true});


sessionSchema.index({
    userId : 1,
    "device.deviceId" : 1,
})

sessionSchema.index({
    userId : 1,
    status : 1,
})


export const Session = model("Session", sessionSchema);