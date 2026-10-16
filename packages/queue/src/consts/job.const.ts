import { QUEUE_NAMES } from "./queue.const.js";

export const JOB_NAMES = {
    [QUEUE_NAMES.EMAIL] : {
        SEND_OTP : "send-otp",
    },
    [QUEUE_NAMES.MAINTENANCE] : {
        CLEAN_UP_CLOUDINARY_TEMP : "clean-up-cloudinary-temp",
    },
} as const;