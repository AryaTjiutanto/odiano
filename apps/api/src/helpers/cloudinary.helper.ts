import { ALLOWED_MEDIA_TYPES, AllowedMediaTypes, PostMedia } from "@odiano/shared";
import cloudinary from "../config/cloudinary.config.js";
import { removeTemp } from "../utils/path.js";

type CloudinaryNewDataResult = {
    publicId : string,
    url : string,
}

export const commitTempImage = async (tempPublicId : string, oldPublicId? : string | null | undefined, resourceType : AllowedMediaTypes = ALLOWED_MEDIA_TYPES.IMAGE) : Promise<CloudinaryNewDataResult | null> => {
    // delete old image
    if (oldPublicId) {
        await cloudinary.api.delete_resources([oldPublicId]);
    }

    // moved new image from temp
    const newPublicId = removeTemp(tempPublicId);

    const result = await cloudinary.uploader.rename(tempPublicId, newPublicId, { resource_type : resourceType });

    if(!result) {
        return null;
    }

    // change the cover data
    return {
        publicId: result.public_id,
        url: result.secure_url,
    };
}

export const deleteImages = async (postsMedia : PostMedia[]) => {
    const images = postsMedia.filter(media => media.type === ALLOWED_MEDIA_TYPES.IMAGE);
    const videos = postsMedia.filter(media => media.type === ALLOWED_MEDIA_TYPES.VIDEO);

    if(images.length > 0) {
        await cloudinary.api.delete_resources(images.map(media => media.source.publicId), {
            resource_type: ALLOWED_MEDIA_TYPES.IMAGE,
        });
    }

    if(videos.length > 0) {
        await cloudinary.api.delete_resources(videos.map(media => media.source.publicId), {
            resource_type: ALLOWED_MEDIA_TYPES.VIDEO,
        });
    }
}