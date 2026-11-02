import { model, Schema, Types } from "mongoose";

type DeviceSchema = {
    deviceId : string,
    userAgent: string | null,
}

type SessionSchema = {
    device: DeviceSchema,
    userId: Types.ObjectId,
    lastActive: Date,
    logoutAt: Date | null,
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
    lastActive : {
        type : Date,
        required : true,
    },
    logoutAt : {
        type : Date,
        required : false,
        default : null
    }
}, {timestamps : true});


export const Session = model("Session", sessionSchema);