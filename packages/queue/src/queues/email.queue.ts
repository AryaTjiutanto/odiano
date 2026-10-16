import { Queue } from "bullmq";
import { getRedis } from "@odiano/redis";
import { EmailJobPayload } from "../types/email.types.js";
import { QUEUE_NAMES } from "../consts/index.js";

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
    connection : getRedis(),
});

export const registerEmailJob = <T extends keyof EmailJobPayload>(jobName : T, data : EmailJobPayload[T]) => {
    emailQueue.add(jobName, data, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: 1000,
        removeOnFail: 1000,
    });
}