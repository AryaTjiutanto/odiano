import Footer from "../components/auth/Footer";
import { useState } from "react";
import { ImageCropper } from "../components/cropper/ImageCropper";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createUserProfileSchema, type CreateUserProfileSchema, BIO_LENGTH, ALLOWED_PROFILE_IMAGE_TYPES, MAX_PROFILE_IMAGE_SIZE } from "@connect/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import DotsLoader from "../components/loader/DotsLoader";
import { useAppDispatch } from "../hooks/useRedux";
import { intitializeAuth } from "../features/auth/auth.thunk";
import { Check, RotateCcw, Upload, User, X } from "lucide-react";
import useDragAndDrop from "../hooks/useDragAndDrop";
import useImageUploadHandler from "../hooks/useImageUpload";
import { createPortal } from 'react-dom';
import { checkUsername, createUserProfile } from "../services/user.service";
import useDebounce from "../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../queries/userKeys";

const OnBoarding = () => {
    const dispatch = useAppDispatch();
    const dragAndDrop = useDragAndDrop();
    const imageUploadHandler = useImageUploadHandler(ALLOWED_PROFILE_IMAGE_TYPES, MAX_PROFILE_IMAGE_SIZE);

    // init form 
    const [formError, setFormError] = useState<string | null>();

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

    // handle username
    const username = watch("username");
    const usernameDebounceValue = useDebounce<string>(username, 600);

    const usernameQuery = useQuery({
        queryKey: userKeys.checkUsername(usernameDebounceValue!),
        queryFn: () => checkUsername(usernameDebounceValue!),
        enabled: !!usernameDebounceValue,
        staleTime: 10 * 1000,
        gcTime: 1 * 24 * 60 * 60 * 1000,
    });

    // handle form
    const onSubmit: SubmitHandler<CreateUserProfileSchema> = async (data) => {
        if (isSubmitting) return;

        if (!usernameQuery.data) {
            setFormError("Username not available")
            return;
        }

        try {
            const dataToSubmit = { ...data };

            // handle image upload
            const uploadedImageData = await imageUploadHandler.uploadImage("/upload/profile-signature", "profile.webp");

            if (!uploadedImageData) {
                throw new Error("Error went uploading the image");
            }

            dataToSubmit.profileImagePublicId = uploadedImageData.profileImagePublicId;
            dataToSubmit.profileImageUrl = uploadedImageData.profileImageUrl;

            // send data
            await createUserProfile(dataToSubmit);

            // onboarding success
            await dispatch(intitializeAuth());

            setFormError(null);
        } catch {
            setFormError("Something went wrong, please try again later")
            return;
        }
    }

    return (
        <>
            {/* head */}
            <title>Set Up Your Profile - Connect</title>
            <meta
                name="description"
                content="Connect with friends, share posts, and explore communities."
            />

            {/* body */}
            {/* cropper */}
            {
                (imageUploadHandler.isCropping && imageUploadHandler.originalImageUrl) && (
                    createPortal(
                        <ImageCropper aspect={1} imageUrl={imageUploadHandler.originalImageUrl} setImageCroppedBlob={imageUploadHandler.setImageCroppedBlob} setIsCropping={imageUploadHandler.setIsCropping} />,
                        document.body
                    )
                )
            }

            {/* content */}
            <div className="bg-neutral-950 min-h-screen">
                <div className="w-full text-neutral-100" onDrop={(e) => dragAndDrop.handleDrop(e, imageUploadHandler.getOriginalImageUrl)} onDragOver={dragAndDrop.handleDragOver} onDragEnter={dragAndDrop.handleDragEnter} onDragLeave={dragAndDrop.handleDragLeave}>
                    <div className="w-full min-h-screen flex items-center justify-center py-10 md:py-20 2xl:py-10 px-10 md:px-0">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full md:max-w-120 2xl:max-w-137.5 flex flex-col items-center">
                            <h1 className="text-center text-2xl md:text-3xl 2xl:text-4xl font-bold">Let anyone know who are you</h1>
                            <div className="my-16 flex flex-col items-center">
                                <label htmlFor="profile-input" className="">
                                    <div className="w-40 h-40 md:w-48 md:h-48 lg:w-40 lg:h-40 rounded-full bg-neutral-900 border-2 border-neutral-500 shadow-lg shadow-neutral-800 grid place-content-center relative overflow-hidden cursor-pointer group hover:border-neutral-400 hover:shadow-xl duration-300">
                                        {
                                            imageUploadHandler.imageCroppedBlob ?
                                                <img src={URL.createObjectURL(imageUploadHandler.imageCroppedBlob)} className="w-full aspect-square rounded-full object-cover absolute z-1"></img>
                                                :
                                                <User className="size-20 text-neutral-700" />
                                        }
                                        <div className={`grid place-content-center absolute top-0 left-0 w-full h-full bg-neutral-900/80 cursor-pointer opacity-0 duration-100 z-10 ${dragAndDrop.isDrag ? "opacity-100" : "group-hover:opacity-100"}`}>
                                            <Upload className="w-10 text-neutral-400" />
                                        </div>
                                    </div>
                                </label>
                                <input type="file" id="profile-input" className="hidden" accept={`${ALLOWED_PROFILE_IMAGE_TYPES.join(", ")}`} onChange={imageUploadHandler.handleImageInput}></input>
                                {
                                    imageUploadHandler.imageError &&
                                    <p className="text-center text-red-500 mt-5">
                                        {imageUploadHandler.imageError}
                                    </p>
                                }
                            </div>
                            <div className="w-full space-y-4">
                                <div>
                                    <input className="w-full h-12 border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" placeholder="Name" {...register("name")}></input>
                                    {
                                        errors.name &&
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.name.message}
                                        </p>
                                    }
                                </div>
                                <div>
                                    <div className="relative h-12">
                                        <input className="w-full h-full border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" placeholder="Username" {...register("username")}></input>

                                        <div className="absolute h-full top-0 flex items-center right-4">
                                            {
                                                usernameQuery.isPending &&
                                                <RotateCcw className="w-3 animate-spin text-neutral-300" />
                                            }
                                            {
                                                usernameQuery.data &&
                                                <div className="w-5 h-5 rounded-full bg-green-500 grid place-content-center">
                                                    <Check className="w-3" />
                                                </div>
                                            }
                                            {
                                                !usernameQuery.data &&
                                                <div className="w-5 h-5 rounded-full bg-red-500 grid place-content-center">
                                                    <X className="w-3" />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    {
                                        errors.username &&
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.username.message}
                                        </p>
                                    }
                                </div>
                            </div>
                            <div className="mt-8 w-full h-28 relative">
                                <textarea className={"w-full h-full border border-neutral-300 rounded-sm placeholder:text-neutral-400 px-6 py-4 text-sm"} placeholder="Bio" {...register("bio")}></textarea>
                                {
                                    errors.bio &&
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.bio.message}
                                    </p>
                                }

                                <div className={`absolute bottom-5 right-5 text-xs ${watch("bio")?.length > BIO_LENGTH.MAX ? "text-red-500" : "text-neutral-400"}`}>
                                    {watch("bio")?.length}/{BIO_LENGTH.MAX}
                                </div>
                            </div>
                            <button type="submit" className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer mt-8 grid place-content-center">
                                {
                                    isSubmitting ?
                                        <DotsLoader />
                                        :
                                        <span>
                                            Done
                                        </span>
                                }
                            </button>
                            {
                                formError &&
                                <p className="text-red-500 text-sm mt-4">
                                    {formError}
                                </p>
                            }
                        </form>
                    </div>
                    <Footer />
                </div>

            </div>
        </>
    )
}

export default OnBoarding;