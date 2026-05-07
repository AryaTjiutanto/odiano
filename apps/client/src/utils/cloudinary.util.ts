export const getCloudinarySignedUrl = (cloudName : string) => {
    return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
}