import { useEffect, useState } from "react";
import { getCroppedImage } from "../../utils/cropImage.util";
import Cropper from "react-easy-crop";
import DotsLoader from "../loader/DotsLoader";
import { MEDIA_ASPECT_RATIO, type MediaAspectRatio } from "@odiano/shared";
import type { FileEditData, FileEditResult, ImageEditorOptions } from "../../types/file.type";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

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
        <div className="w-full h-screen grid place-content-center py-20 fixed top-0 left-0 bottom-0 right-0 z-30">
            {/* background */}
            <div className="w-full h-full absolute bg-black/50 cursor-pointer" onClick={() => handleClose(null)}></div>

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
            </div>

            {/* cropper */}
            <div className="bg-neutral-900 rounded-xl flex flex-col overflow-hidden relative">
                <div className="w-full h-14 sm:h-12 xl:h-10 border-b border-neutral-800 flex items-center justify-between px-4 text-sm text-neutral-300 bg-[#111111]">
                    <div className="flex items-center">
                        <button className="w-8 aspect-square rounded-full bg-transparent hover:bg-red-500/10 text-neutral-300 hover:text-red-500 grid place-content-center duration-100 cursor-pointer -translate-x-1.5" onClick={() => handleClose(null)}>
                            <X className="w-5 z-1 relative" />
                        </button>
                        <h1 className="font-bold">
                            Edit Image
                        </h1>
                    </div>

                    <button
                        onClick={handleEditing}
                        className={`rounded-lg duration-100 flex items-center justify-center relative font-semibold ${isLoading ? "cursor-progress" : "text-sky-400 hover:text-sky-600 cursor-pointer"}`}
                        disabled={isLoading}
                    >
                        {
                            isLoading ?
                                <div className="flex items-center text-neutral-100">
                                    <DotsLoader size="small" />
                                </div>
                                :
                                <p>
                                    Done
                                </p>
                        }
                    </button>
                </div>
                <div className="w-full flex flex-col sm:flex-row flex-1 min-h-[40vh] md:min-h-[45vh] lg:min-h-[30vh] xl:min-h-[40vh] 2xl:min-h-[50vh]  xl:max-h-[65vh] max-w-[85vw]">
                    {/* preview */}
                    <div className="h-full w-full sm:w-[60vw] max-h-[40vh] sm:max-h-[80vh] lg:w-[380px] 2xl:w-[500px]">
                        {
                            selectedAspectRatio == "original" ?
                                <div className="relative overflow-y-auto w-full h-full overflow-hidden grid place-content-center">
                                    <div className="absolute w-full h-full bg-center blur-sm opacity-60" style={{ backgroundImage: `url(${URL.createObjectURL(imageBlob)})` }}></div>
                                    <div className="relative overflow-hidden">
                                        <img src={URL.createObjectURL(imageBlob)} className="w-full h-full" />
                                    </div>
                                </div>
                                :
                                <div className="relative h-full w-full overflow-hidden">
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
                    </div>

                    {/* aspect ratio */}
                    {options.allowAspectRatioChange && (
                        <div className="w-full sm:w-32 h-24 sm:h-auto border-t sm:border-t-0 border-l-0 sm:border-l border-neutral-700 bg-[#111111] overflow-hidden">
                            {/* horizontal Swiper */}
                            <div className="w-[93%] mx-auto h-full sm:hidden flex items-center">
                                <Swiper
                                    slidesPerView="auto"
                                    spaceBetween={12}
                                    className=""
                                >
                                    {Object.entries(MEDIA_ASPECT_RATIO).map(([key, value]) => (
                                        <SwiperSlide key={key} className="!w-auto">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedAspectRatio(value)}
                                                className="h-14 px-1 flex items-center cursor-pointer group"
                                            >
                                                <div
                                                    className={`
                                h-full 
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
                                                    <span className="text-sm">{key}</span>
                                                </div>
                                            </button>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* vertical list */}
                            <div className="hidden sm:block h-full overflow-y-auto overflow-x-hidden">
                                <div className="w-full flex flex-col items-center text-neutral-50 gap-3 py-5">
                                    {Object.entries(MEDIA_ASPECT_RATIO).map(([key, value]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setSelectedAspectRatio(value)}
                                            className="h-fit w-fit cursor-pointer group"
                                        >
                                            <div
                                                className={`
                            h-fit w-16 2xl:w-20
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
                                                <span className="text-sm">{key}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImageEditor;