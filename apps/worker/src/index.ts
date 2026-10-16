import "./bootstraps/env.bootstrap.js";
import { JOB_NAMES, QUEUE_NAMES } from "@odiano/queue";
import logger from "./lib/log/logger.js";
import { registerMaintenanceScheduler } from "./schedulers/maintenance.schedule.js";
import { emailWorker } from "./worker/email.worker.js";
import { maintenanceWorker } from "./worker/maintenance.worker.js";

// register maintenance scheduler
registerMaintenanceScheduler(JOB_NAMES[QUEUE_NAMES.MAINTENANCE].CLEAN_UP_CLOUDINARY_TEMP);

// maintenance worker
maintenanceWorker.on("active", () => {
    logger.info("Maintenance worker is active and processing jobs...");
})

maintenanceWorker.on("completed",(job) => {
    logger.info(`Maintenance job with ID ${job.id} has been completed successfully.`);
})

maintenanceWorker.on("failed", (job, err) => {
    logger.error(`Maintenance job with ID ${job?.id} has failed. Error: ${err.message}`);
})

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