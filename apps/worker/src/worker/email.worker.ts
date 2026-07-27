import { QUEUE_NAMES } from "@connect/queue";
import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";
import { getRedis } from "@connect/redis";

export const emailWorker = new Worker(QUEUE_NAMES.EMAIL, async (job) => {
    const response = await sendEmail(job.data);
    return response;
}, {connection : getRedis(), concurrency : 5});