import { useEffect, useState } from "react";
import { getCroppedImage } from "../../utils/cropImage.util";
import Cropper from "react-easy-crop";
import DotsLoader from "../loader/DotsLoader";

type Payload = {
    imageUrl: string,
    aspect : number,
    setIsCropping: React.Dispatch<React.SetStateAction<boolean>>,
    setImageCroppedBlob: React.Dispatch<React.SetStateAction<Blob | null>>,
}

export const ImageCropper = (payload: Payload) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imageCroppedAreaPixels, setImageCroppedAreaPixels] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCrop = async () => {
        if (!payload.imageUrl) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const blob = await getCroppedImage(payload.imageUrl, imageCroppedAreaPixels);

        if (!blob) {
            setIsLoading(false);
            return;
        }

        payload.setImageCroppedBlob(blob);
        payload.setIsCropping(false);
    }

    useEffect(() => {
        const handleKeyDown = (e : KeyboardEvent) => {
            if(e.key == "Escape") {
                payload.setIsCropping(false);
                setIsLoading(true);
            } else if (e.key == "Enter") {
                handleCrop();
            }
        }

        document.addEventListener("keyup", handleKeyDown);

        return () => {
            document.removeEventListener("keyup", handleKeyDown);
        }
    })

    return (
        <div className="w-full h-screen grid place-content-center py-20">
            {/* shortcut key */}
            <div className="hidden lg:flex flex-col absolute top-10 2xl:top-20 left-10 2xl:left-32 text-neutral-100 bg-neutral-900 p-5 border border-neutral-700 rounded-lg">
                <h1 className="font-bold">
                    Shortcut key
                </h1>
                <div className="flex flex-col space-y-3 mt-3">
                    <div className="flex items-center space-x-1 xl:space-x-2">
                        <div className="w-48 xl:w-52">
                            <span className="text-sm text-neutral-300">
                                Close the cropping process
                            </span>
                        </div>
                        <kbd className="h-5 px-2 bg-neutral-800 border border-neutral-500 rounded text-xs">
                            Esc
                        </kbd>
                    </div>
                    <div className="flex items-center space-x-1 xl:space-x-2">
                        <div className="w-48 xl:w-52">
                            <span className="text-sm text-neutral-300">
                                Finish the cropping process
                            </span>
                        </div>
                        <kbd className="h-5 px-2 bg-neutral-800 border border-neutral-500 rounded text-xs">
                            Enter
                        </kbd>
                    </div>
                </div>
            </div>

            {/* cropper */}
            <div className="w-[75vw] md:w-[60vw] lg:w-[350px] 2xl:w-[500px] max-h-[70%]">
                <div className="w-full aspect-square relative overflow-hidden rounded-xl border border-neutral-600">
                    <Cropper
                        crop={crop}
                        zoom={zoom}
                        aspect={payload.aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        image={payload.imageUrl}
                        onCropComplete={(_, croppedAreaPixels) => {
                            setImageCroppedAreaPixels(croppedAreaPixels);
                        }}
                    />
                </div>
                <button
                    onClick={handleCrop}
                    className={`w-full h-12 bg-white text-neutral-800 rounded-lg duration-150 mt-10 flex items-center justify-center relative ${isLoading ? "cursor-progress" : "hover:bg-neutral-200 cursor-pointer"}`}
                    disabled={isLoading}
                >
                    {
                        isLoading ?
                        <div className="flex items-center text-black">
                            <DotsLoader/>
                        </div>
                        :
                        <p>
                            Done
                        </p>
                    }
                </button>
            </div>
        </div>
    )
}