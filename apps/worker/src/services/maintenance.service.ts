import cloudinary from "../config/cloudinary.config.js";
import logger from "../lib/log/logger.js";

export const deleteExpiredTempAssets = async () => {
    const EXPIRED_AFTER = 1 * 60 * 60 * 1000;

    const result = await cloudinary.search
        .expression("public_id=temp/*")
        .max_results(500)
        .execute();

    const assets = result.resources;

    if (!assets) return;

    const now = Date.now();
    const expiredAssets = assets.filter((asset: any) => {
        const createdDate = new Date(asset.created_at).getTime();

        return now - createdDate > EXPIRED_AFTER;
    });

    if (expiredAssets.length === 0) {
        logger.info("No expired temp assets");
        return;
    }

    const expiredAssetsPublicId = expiredAssets.map((asset: any) => asset.public_id)

    await cloudinary.api.delete_resources(expiredAssetsPublicId);

    logger.info(`Deleted ${expiredAssetsPublicId.length} temp asset`)
}