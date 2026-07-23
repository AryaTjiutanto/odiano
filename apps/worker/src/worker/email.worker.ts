import { QUEUE_NAMES } from "@connect/queue";
import { redis } from "@connect/redis";
import { Worker } from "bullmq";
import { sendEmail } from "../services/email.service";

export const emailWorker = new Worker(QUEUE_NAMES.EMAIL, async (job) => {
    const response = await sendEmail(job.data);
    return response;
}, {connection : redis, concurrency : 5});