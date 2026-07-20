import cloudinary from "../config/cloudinary.config";
import { removeTemp } from "../utils/path";

type CloudinaryNewDataResult = {
    publicId : string,
    url : string
}

export const commitTempImage = async (tempPublicId : string, oldPublicId? : string | null | undefined) : Promise<CloudinaryNewDataResult | null> => {
    // delete old image
    if (oldPublicId) {
        await cloudinary.api.delete_resources([oldPublicId]);
    }

    // moved new image from temp
    const newPublicId = removeTemp(tempPublicId);

    const result = await cloudinary.uploader.rename(tempPublicId, newPublicId);

    if(!result) {
        return null;
    }

    // change the cover data
    return {
        publicId: result.public_id,
        url: result.secure_url,
    };
}