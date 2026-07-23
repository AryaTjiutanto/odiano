import logger from "./lib/log/logger";
import { emailWorker } from "./worker/email.worker";

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