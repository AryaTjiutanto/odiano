import { useState, type ChangeEvent } from "react";
import { uploadImageToCloudinary } from "../services/cloudinary.service";
import { DEFAULT_ALLOWED_IMAGE_TYPES, DEFAULT_MAX_IMAGE_SIZE } from "../consts/image.const";
import type { UploadedImageData } from "../types/image.type";

type UseImageUploadOptions = {
    allowedTypes? : string[],
    maxSize? : number,
    multiple? : boolean,
};

type ImageError = {
    id : string,
    message : string,
}

const useImageUploadHandler = ({
    allowedTypes = DEFAULT_ALLOWED_IMAGE_TYPES, 
    maxSize = DEFAULT_MAX_IMAGE_SIZE, 
    multiple = false
} : UseImageUploadOptions = {}) => {
    const [isCropping, setIsCropping] = useState<boolean>(false);

    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<ImageError | null>(null);

    const [prevImageCroppedBlob, setPrevImageCroppedBlob] = useState<Blob | null>(null);
    const [imageCroppedBlob, setImageCroppedBlob] = useState<Blob | null>(null);

    const [uploadedImagePublicId, setUploadedImagePublicId] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const getOriginalImageUrl = (file: File | undefined) => {
        if (!file) {
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setImageError({
                id : Date.now().toString(),
                message : "Only png, jpeg and webp allowed"
            });
            
            return;
        }
        
        if (file.size > maxSize) {
            setImageError({
                id : Date.now().toString(),
                message : `Max image size is ${maxSize / (1024 * 1024)}mb`
            });

            return;
        }
        
        const url = URL.createObjectURL(file);
        setOriginalImageUrl(url);

        setIsCropping(true);
        setImageError(null);
    }

    const removeImage = (fn : () => void) => {
        setOriginalImageUrl(null);
        setImageCroppedBlob(null);
        fn();
    }

    const handleImageInput = (e : ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(!file) return;

        setImageError(null);
        getOriginalImageUrl(file);
    }

    const uploadImage = async (generatorRoute : string, imageName : string) : Promise<UploadedImageData | null> => {
        const isImageNotChange = imageCroppedBlob == prevImageCroppedBlob;

        if (isImageNotChange && uploadedImagePublicId && uploadedImageUrl) {
            return {
                publicId : uploadedImagePublicId,
                url : uploadedImageUrl,
            }
        }

        if (imageCroppedBlob && !isImageNotChange) {
            const result = await uploadImageToCloudinary({
                generatorRoute,
                imageCroppedBlob,
                imageName
            })

            setPrevImageCroppedBlob(imageCroppedBlob);

            setUploadedImagePublicId(result.publicId);
            setUploadedImageUrl(result.url);

            return {
                publicId : result.publicId,
                url : result.url,
            }
        }

        return null;
    }

    return {
        getOriginalImageUrl,
        uploadImage,
        handleImageInput,
        removeImage,

        imageError,
        originalImageUrl,
        
        isCropping,
        setIsCropping,

        prevImageCroppedBlob,
        setPrevImageCroppedBlob,

        imageCroppedBlob,
        setImageCroppedBlob,


        uploadedImagePublicId,
        setUploadedImagePublicId,

        uploadedImageUrl,
        setUploadedImageUrl,
    }
}

export default useImageUploadHandler;