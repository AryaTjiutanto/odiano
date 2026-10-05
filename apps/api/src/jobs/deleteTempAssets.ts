import cron from "node-cron";
import * as tempAssetsService from "../services/tempAssets.service.js";

export const startDeleteExpiredTempAssets = async () => {
    cron.schedule("0 */12 * * *", () => {
        try {
            tempAssetsService.deleteExpiredTempAssets();
        } catch (err : any) {
            console.log("Error appear when clean up Temp assets")
            console.log(err);
        }
    })
}