import { JOB_NAMES, QUEUE_NAMES } from "../consts/index.js";

export type SendOTPData = {
    id: string;
    email: string;
    content: string;
}

export type EmailJobPayload = {
    [k in typeof JOB_NAMES[typeof QUEUE_NAMES.EMAIL]["SEND_OTP"]]: SendOTPData;
}