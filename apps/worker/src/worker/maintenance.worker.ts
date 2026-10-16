import { JOB_NAMES, QUEUE_NAMES } from "@odiano/queue";
import { getRedis } from "@odiano/redis";
import { Worker } from "bullmq";
import { deleteExpiredTempAssets } from "../services/maintenance.service.js";

export const maintenanceWorker = new Worker(QUEUE_NAMES.MAINTENANCE, async (job) => {
    switch (job.name) {
        case JOB_NAMES[QUEUE_NAMES.MAINTENANCE].CLEAN_UP_CLOUDINARY_TEMP:
            await deleteExpiredTempAssets();
    }
}, { connection: getRedis(), concurrency: 5 })