import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../queue.const.js";
import { getRedis } from "@odiano/redis";

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
    connection : getRedis(),
});