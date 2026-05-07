export const getCroppedImage = async (imageSrc : string, crop : any) => {
    const image = new Image(); 
    image.src = imageSrc;

    await new Promise((resolve) => {
        image.onload = resolve;
    })

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx?.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
    );

    return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/webp")
    })
}