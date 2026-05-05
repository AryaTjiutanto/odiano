import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../components/auth/Footer";
import { faCheckCircle, faRotate, faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { ImageCropper } from "../components/cropper/ImageCropper";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createUserProfileSchema, type SuccessResponseData, type CreateUserProfileSchema } from "@connect/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../libs/api";

const OnBoarding = () => {
    //  handle image
    const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
    const [isCropping, setIsCropping] = useState<boolean>(false);

    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [imageCroppedUrl, setImageCroppedUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setImageError("Only png, jpeg and webp allowed");
            return;
        }

        if (file.size > 5120) {
            setImageError("Max image size is 5mb");
            return;
        }

        const url = URL.createObjectURL(file);
        setOriginalImageUrl(url);

        setIsCropping(true);
    }

    // handle form
    const {
        register,
        setError,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateUserProfileSchema>({
        mode: "onTouched",
        resolver: zodResolver(createUserProfileSchema)
    })

    const onSubmit: SubmitHandler<CreateUserProfileSchema> = (data) => {
        console.log(data);
    }

    // handle username
    const [isUsernameLoading, setIsUsernameloading] = useState<boolean>(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(false);
    const username = watch("username");

    useEffect(() => {
        if (!username) return;

        setIsUsernameAvailable(false);

        const timeout = setTimeout(async () => {
            try {
                setIsUsernameloading(true);

                const response = await api.get<SuccessResponseData<{ available: boolean }>>("/users/check-username", {
                    params: {
                        username,
                    }
                });

                const isAvaiable = response.data.data?.available;

                if (!isAvaiable) {
                    setError("username", {
                        type: "manual",
                        message: "Username already used",
                    })
                } else {
                    setIsUsernameAvailable(true);
                }

                setIsUsernameloading(false);
            } catch {
                setError("username", {
                    type: "manual",
                    message: "Something went wrong, try again later"
                })
            }
        }, 600);

        return () => clearTimeout(timeout);
    }, [username])

    return (
        <div className="bg-neutral-950 min-h-screen">
            {
                (isCropping && originalImageUrl) && (
                    <ImageCropper aspect={1} imageUrl={originalImageUrl} setImageCroppedUrl={setImageCroppedUrl} setIsCropping={setIsCropping} />
                )
            }
            {
                !isCropping &&
                <div className="w-full text-neutral-100">
                    <div className="w-full min-h-screen grid place-content-center py-20 2xl:py-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[550px] flex flex-col items-center">
                            <h1 className="text-3xl 2xl:text-4xl font-bold">Let anyone know who are you</h1>
                            <div className="my-16 flex flex-col items-center">
                                <label htmlFor="profile-input" className="">
                                    <div className="w-40 h-40 rounded-full bg-neutral-900 border-2 border-neutral-500 shadow-lg shadow-neutral-800 grid place-content-center relative overflow-hidden cursor-pointer group hover:border-neutral-400 hover:shadow-xl duration-300">
                                        {
                                            imageCroppedUrl ?
                                                <img src={imageCroppedUrl} className="w-full aspect-square rounded-full object-cover absolute z-[1]"></img>
                                                :
                                                <FontAwesomeIcon icon={faUser} className="text-[80px] text-neutral-700" />
                                        }
                                        <div className="grid place-content-center absolute top-0 left-0 w-full h-full bg-neutral-900/80 cursor-pointer opacity-0 group-hover:opacity-100 duration-100 z-10">
                                            <FontAwesomeIcon icon={faUpload} className="text-4xl text-neutral-400" />
                                        </div>
                                    </div>
                                </label>
                                <input type="file" id="profile-input" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload}></input>
                                {
                                    imageError &&
                                    <p className="text-center text-red-500 mt-5">
                                        {imageError}
                                    </p>
                                }
                            </div>
                            <div className="w-full space-y-4">
                                <div>
                                    <input className="w-full h-12 border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="email" placeholder="Name" {...register("name")}></input>
                                    {
                                        errors.name &&
                                        <p className="text-xs text-red-500">
                                            {errors.name.message}
                                        </p>
                                    }
                                </div>
                                <div>
                                    <div className="relative h-12">
                                        <input className="w-full h-full border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="email" placeholder="Username" {...register("username")}></input>

                                        <div className="absolute h-full top-0 flex items-center right-4">
                                            {
                                                isUsernameLoading &&
                                                <FontAwesomeIcon icon={faRotate} className="text-xs animate-spin text-neutral-300" />
                                            }
                                            {
                                                isUsernameAvailable &&
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                                            }
                                        </div>
                                    </div>
                                    {
                                        errors.username &&
                                        <p className="text-xs text-red-500">
                                            {errors.username.message}
                                        </p>
                                    }
                                </div>
                            </div>
                            <div className="mt-8 w-full h-28 relative">
                                <textarea className={"w-full h-full border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-6 py-4 text-sm"} placeholder="Bio" {...register("bio")}></textarea>
                                {
                                    errors.bio &&
                                    <p className="text-xs text-red-500">
                                        {errors.bio.message}
                                    </p>
                                }

                                <div className={`absolute bottom-5 right-5 text-xs ${watch("bio")?.length > 50 ? "text-red-500" : "text-neutral-400"}`}>
                                    {watch("bio")?.length}/50
                                </div>
                            </div>
                            <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer mt-8">
                                Done
                            </button>
                        </form>
                    </div>
                    <Footer />
                </div>
            }
        </div>
    )
}

export default OnBoarding;