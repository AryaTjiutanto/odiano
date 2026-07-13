import { useState, type ChangeEvent } from "react";
import { uploadImageToCloudinary } from "../services/cloudinary.service";

type UploadedImageData = {
    profileImagePublicId: string,
    profileImageUrl: string
}

const useImageUploadHandler = (ALLOWED_IMAGE_TYPES: string[], MAX_IMAGE_SIZE: number) => {
    const [isCropping, setIsCropping] = useState<boolean>(false);

    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    const [prevImageCroppedBlob, setPrevImageCroppedBlob] = useState<Blob | null>(null);
    const [imageCroppedBlob, setImageCroppedBlob] = useState<Blob | null>(null);

    const [uploadedImagePublicId, setUploadedImagePublicId] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const getOriginalImageUrl = (file: File | undefined) => {
        if (!file) {
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setImageError("Only png, jpeg and webp allowed");
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setImageError(`Max image size is ${MAX_IMAGE_SIZE / (1024 * 1024)}mb`);
            return;
        }

        const url = URL.createObjectURL(file);
        setOriginalImageUrl(url);

        setIsCropping(true);
        setImageError(null);
    }

    const handleImageInput = (e : ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(!file) return;

        getOriginalImageUrl(file);
    }

    const uploadImage = async (generatorRoute : string, imageName : string) : Promise<UploadedImageData | null> => {
        const isImageNotChange = imageCroppedBlob == prevImageCroppedBlob;

        if (isImageNotChange && uploadedImagePublicId && uploadedImageUrl) {
            return {
                profileImagePublicId : uploadedImagePublicId,
                profileImageUrl : uploadedImageUrl,
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
                profileImagePublicId : result.publicId,
                profileImageUrl : result.url,
            }
        }

        return null;
    }

    return {
        getOriginalImageUrl,
        uploadImage,
        handleImageInput,

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