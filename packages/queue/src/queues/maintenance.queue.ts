import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../queue.const.js";
import { getRedis } from "@odiano/redis";

export const maintenanceQueue = new Queue(QUEUE_NAMES.MAINTENANCE, {
    connection : getRedis(),
})