import { maintenanceQueue } from "@odiano/queue"

export const registerMaintenanceScheduler = async (jobName: string, every : number = 1 * 24 * 60 * 60 * 1000) => {
    await maintenanceQueue.upsertJobScheduler(
        jobName, 
        {
            every,
        },
        {
            name : jobName,
            opts : {
                backoff : {
                    type : "exponential",
                    delay : 3000
                },
                attempts : 5,
                removeOnFail : 10,
            }
        }
    )
}