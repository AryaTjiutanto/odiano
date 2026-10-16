import { JOB_NAMES, QUEUE_NAMES } from "@odiano/queue";
import "./bootstrap/env.bootstrap.js";
import logger from "./lib/log/logger.js";
import { registerMaintenanceScheduler } from "./schedulers/maintenance.schedule.js";
import { emailWorker } from "./worker/email.worker.js";

// register maintenance scheduler
registerMaintenanceScheduler(JOB_NAMES[QUEUE_NAMES.MAINTENANCE].CLEAN_UP_CLOUDINARY_TEMP);

// email worker
emailWorker.on("active", () => {
    logger.info("Email worker is active and processing jobs...");
})

emailWorker.on("completed",(job) => {
    logger.info(`Email job with ID ${job.id} has been completed successfully.`);
})

emailWorker.on("failed", (job, err) => {
    logger.error(`Email job with ID ${job?.id} has failed. Error: ${err.message}`);
})