import { useEffect, useState } from "react";
import { getCroppedImage } from "../../utils/cropImage.util";
import Cropper from "react-easy-crop";
import DotsLoader from "../loader/DotsLoader";
import { MEDIA_ASPECT_RATIO, type MediaAspectRatio } from "@odiano/shared";
import type { FileEditData, FileEditResult, ImageEditorOptions } from "../../types/file.type";

type Payload = {
    handleComplete: (result: FileEditResult) => void,
    handleClose: (result: null) => void,
    imageBlob: Blob | null,
    editData: FileEditData | undefined,
    options: ImageEditorOptions,
}

const ImageEditor = ({ imageBlob, options, editData, handleComplete, handleClose }: Payload) => {
    const [crop, setCrop] = useState(editData?.crop || { x: 0, y: 0 });
    const [zoom, setZoom] = useState(editData?.zoom || 1);
    const [imageCroppedAreaPixels, setImageCroppedAreaPixels] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<MediaAspectRatio>(editData?.aspectRatio || options.aspectRatio);

    // handler
    const handleCrop = async () => {
        if (!imageBlob) return;
        setIsLoading(true);

        const blob = await getCroppedImage(URL.createObjectURL(imageBlob), imageCroppedAreaPixels);

        if (!blob) {
            setIsLoading(false);
            return;
        }

        handleComplete({
            blob,
            editData: {
                aspectRatio: selectedAspectRatio,
                zoom,
                crop,
            }
        })
    }

    const handleEditing = () => {
        if (!imageBlob) return;
        if (selectedAspectRatio == "original") {
            handleComplete({
                blob: imageBlob,
                editData: {
                    aspectRatio: selectedAspectRatio,
                    zoom,
                    crop,
                }
            })
            return;
        }

        handleCrop();
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key == "Escape") {
                handleClose(null);
                setIsLoading(true);
            } else if (e.key == "Enter") {
                handleCrop();
            }
        }

        document.addEventListener("keyup", handleKeyDown);

        return () => {
            document.removeEventListener("keyup", handleKeyDown);
        }
    }, [handleClose, handleCrop])

    if (!imageBlob) return null;

    return (
        <div className="w-full h-screen grid place-content-center py-20 fixed top-0 left-0 bottom-0 right-0 bg-black z-30">
            {/* left setting */}
            <div className="absolute top-10 2xl:top-20 left-10 2xl:left-32 flex flex-col space-y-5">
                {/* shortcut key */}
                <div className="hidden xl:flex flex-col text-neutral-100 bg-neutral-950 p-5 border border-neutral-700 rounded-lg">
                    <h1 className="font-bold">
                        Shortcut key
                    </h1>
                    <div className="flex flex-col space-y-3 mt-3">
                        <div className="flex items-center space-x-1 xl:space-x-2">
                            <div className="w-48 xl:w-52">
                                <span className="text-sm text-neutral-300">
                                    Close the edit process
                                </span>
                            </div>
                            <kbd className="h-5 px-2 bg-neutral-900 border border-neutral-500 rounded text-xs">
                                Esc
                            </kbd>
                        </div>
                        <div className="flex items-center space-x-1 xl:space-x-2">
                            <div className="w-48 xl:w-52">
                                <span className="text-sm text-neutral-300">
                                    Finish the edit process
                                </span>
                            </div>
                            <kbd className="h-5 px-2 bg-neutral-900 border border-neutral-500 rounded text-xs">
                                Enter
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* aspect ratio */}
                {
                    options.allowAspectRatioChange &&
                    <div className="flex flex-col text-neutral-50">
                        <h1 className="font-bold">
                            Aspect ratio
                        </h1>

                        <div className="h-16 lg:h-fit flex flex-row md:flex-col items-stretch gap-4 mt-5">
                            {Object.entries(MEDIA_ASPECT_RATIO).map(([key, value]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelectedAspectRatio(value)}
                                    className="h-full md:h-fit w-fit cursor-pointer group"
                                >
                                    <div
                                        className={`
                        h-full w-fit md:w-16 2xl:w-20
                        ${key === "original" ? "p-3" : ""}
                        border grid place-content-center rounded
                        duration-100
                        ${value === selectedAspectRatio
                                                ? "border-2 border-sky-500 text-sky-500"
                                                : "border-neutral-500 text-neutral-500 group-hover:border-neutral-400 group-hover:text-neutral-400"
                                            }
                    `}
                                        style={{
                                            ...(key !== "original" && {
                                                aspectRatio: value,
                                            }),
                                        }}
                                    >
                                        <span className="text-sm">
                                            {key}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                }
            </div>

            {/* cropper */}
            <div className="w-[75vw] md:w-[60vw] lg:w-[350px] 2xl:w-[500px] max-h-[70%]">
                {
                    selectedAspectRatio == "original" ?
                        <div className="relative max-h-[85vh] overflow-y-auto w-full overflow-hidden rounded-xl border border-neutral-600">
                            <img src={URL.createObjectURL(imageBlob)} className="w-full h-full" />
                        </div>
                        :
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-600">
                            <Cropper
                                crop={crop}
                                zoom={zoom}
                                aspect={selectedAspectRatio}
                                onCropChange={isLoading ? () => { } : setCrop}
                                onZoomChange={isLoading ? () => { } : setZoom}
                                image={URL.createObjectURL(imageBlob)}
                                onCropComplete={(_, croppedAreaPixels) => {
                                    setImageCroppedAreaPixels(croppedAreaPixels);
                                }}
                            />

                            {isLoading && (
                                <div className="absolute inset-0 z-10 cursor-not-allowed" />
                            )}
                        </div>
                }
                <div className="mt-10 space-y-3">
                    <button
                        onClick={handleEditing}
                        className={`w-full h-12 bg-white text-neutral-800 rounded-lg duration-150 flex items-center justify-center relative ${isLoading ? "cursor-progress" : "hover:bg-neutral-200 cursor-pointer"}`}
                        disabled={isLoading}
                    >
                        {
                            isLoading ?
                                <div className="flex items-center text-black">
                                    <DotsLoader />
                                </div>
                                :
                                <p>
                                    Done
                                </p>
                        }
                    </button>
                    <button
                        onClick={() => handleClose(null)}
                        className={`w-full h-12 bg-red-500 md:hidden text-neutral-200 rounded-lg duration-150 flex items-center justify-center relative cursor-pointer ${isLoading ? "hidden" : ""}`}
                        disabled={isLoading}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageEditor;