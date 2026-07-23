import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../queue.const";

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL);