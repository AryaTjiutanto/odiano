import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../components/auth/Footer";
import { faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ImageCropper } from "../components/cropper/ImageCropper";

const OnBoarding = () => {
    const [isCropping, setIsCropping] = useState<boolean>(false);

    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [imageCroppedUrl, setImageCroppedUrl] = useState<string | null>(null);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const url = URL.createObjectURL(file);
        setOriginalImageUrl(url);

        setIsCropping(true);
    }

    return (
        <div className="bg-neutral-950 min-h-screen">
            {
                (isCropping && originalImageUrl) && (
                    <ImageCropper imageUrl={originalImageUrl} setImageCroppedUrl={setImageCroppedUrl} setIsCropping={setIsCropping}/>
                )
            }
            {
                !isCropping &&
                <div className="w-full text-neutral-100">
                    <div className="w-full min-h-screen grid place-content-center">
                        <div className="w-full max-w-[550px] flex flex-col items-center">
                            <h1 className="text-4xl font-bold">Let anyone know who are you</h1>
                            <div className="my-16">
                                <label htmlFor="profile-input" className="">
                                    <div className="w-40 h-40 rounded-full bg-neutral-900 border-2 border-neutral-500 shadow-lg shadow-neutral-800 grid place-content-center relative overflow-hidden cursor-pointer group hover:border-neutral-400 hover:shadow-xl duration-300">
                                        {
                                            imageCroppedUrl ?
                                                <img src={imageCroppedUrl} className="w-full aspect-square rounded-full object-cover absolute z-[1]"></img>
                                                :
                                                <FontAwesomeIcon icon={faUser} className="text-[80px] text-neutral-700" />
                                        }
                                        <div className="grid place-content-center absolute top-0 left-0 w-full h-full bg-neutral-900/80 cursor-pointer opacity-0 group-hover:opacity-100 duration-100 z-10">
                                            <FontAwesomeIcon icon={faUpload} className="text-4xl text-neutral-400"/>
                                        </div>
                                    </div>
                                </label>
                                <input type="file" id="profile-input" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload}></input>
                            </div>
                            <div className="w-full space-y-4">
                                <div>
                                    <input className="w-full h-12 border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="email" placeholder="Name"></input>
                                </div>
                                <div>
                                    <input className="w-full h-12 border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="email" placeholder="Username"></input>
                                </div>
                            </div>
                            <div className="mt-8 w-full h-fit relative">
                                <textarea className="w-full h-28 border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-6 py-4 text-sm" placeholder="Bio"></textarea>
                            </div>
                            <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer mt-5">
                                Done
                            </button>
                        </div>
                    </div>
                    <Footer />
                </div>
            }
        </div>
    )
}

export default OnBoarding;