
import { BIO_LENGTH, updateUserProfile, type UpdateUserProfile, type UserProfileDTO } from "@odiano/shared";
import GoBackIconButton from "../../components/common/GoBackIconButton";
import ProfileComponent from "../../components/profile/Profile";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../../queries/userKeys";
import { getUserProfile, updateProfile } from "../../services/user.service";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { useEffect } from "react";
import EditProfileSkeletonLoading from "../../components/profile/EditProfileSkeletonLoading";
import { Upload, X } from "lucide-react";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import { COVER_MAX_IMAGE_SIZE, DEFAULT_ALLOWED_IMAGE_TYPES } from "../../consts/file.const";
import { createPortal } from "react-dom";
import { ImageCropper } from "../../components/cropper/ImageCropper";
import { notify } from "../../helpers/notification/notify.helper";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import DotsLoader from "../../components/loader/DotsLoader";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { setCurrentUserProfile } from "../../features/auth/auth.slice";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import useFileUpload from "../../hooks/useFileUpload";

const EditProfile = () => {
    const username = useAppSelector(state => state.auth.user?.username);
    const setQueryDataHandler = useSetQueryDataHandler();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const coverDragAndDrop = useDragAndDrop();
    const profileDragAndDrop = useDragAndDrop();

    const profileImageUpload = useFileUpload({
        type: "profile",
    });
    const coverImageUpload = useFileUpload({
        maxImageSize: COVER_MAX_IMAGE_SIZE,
        type: "cover",
    })

    // get user profile
    const userProfile = useQuery({
        queryKey: userKeys.profile(username),
        queryFn: async (): Promise<UserProfileDTO> => await getUserProfile(username!),
        enabled: !!username,
        staleTime: 10 * 1000,
        gcTime: DEFAULT_GC_TIME,
    })

    // handle form
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        setError,
        formState: { errors, isSubmitting },
        control
    } = useForm<UpdateUserProfile>({
        mode: "onTouched",
        resolver: zodResolver(updateUserProfile),
    })

    const coverImageUrl = useWatch({
        control,
        name: "coverImageUrl"
    })

    const update: SubmitHandler<UpdateUserProfile> = async (data) => {
        const dataToSend = {
            ...data
        }

        try {
            let coverImageUrl: string | null;
            let profileImageUrl: string | null;

            // upload profile image
            if (profileImageUpload.fileData && profileImageUpload.fileData.length > 0 && profileImageUpload.fileData[0].blob?.edited) {
                profileImageUrl = URL.createObjectURL(profileImageUpload.fileData[0].blob?.edited || profileImageUpload.fileData[0].blob?.original);

                const imageData = await profileImageUpload.uploadFile();

                if (!imageData || Array.isArray(imageData)) {
                    notify.error({
                        title: "Failed to upload profile image",
                        description: "Please try again in a moment.",
                    });

                    return;
                }

                dataToSend.profileImagePublicId = imageData.publicId;
                dataToSend.profileImageUrl = imageData.url;
            }

            // upload cover image
            if (coverImageUpload.fileData && coverImageUpload.fileData.length > 0 && coverImageUpload.fileData[0].blob?.edited) {
                coverImageUrl = URL.createObjectURL(coverImageUpload.fileData[0].blob?.edited || coverImageUpload.fileData[0].blob?.original);

                const imageData = await coverImageUpload.uploadFile();

                if (!imageData || Array.isArray(imageData)) {
                    notify.error({
                        title: "Failed to upload cover image",
                        description: "Please try again in a moment.",
                    });

                    return;
                }

                dataToSend.coverImagePublicId = imageData.publicId;
                dataToSend.coverImageUrl = imageData.url
            }

            // update profile
            const response = await updateProfile(dataToSend);

            if (response.success) {
                setQueryDataHandler<UserProfileDTO>(userKeys.profile(username), (oldData) => {
                    const data = {
                        ...oldData,
                        bio: dataToSend.bio,
                        name: dataToSend.name,
                        ...((dataToSend.coverImagePublicId && dataToSend.coverImageUrl) ?
                            {
                                coverImage: {
                                    publicId: dataToSend.coverImagePublicId,
                                    url: coverImageUrl || userProfile.data?.coverImage?.url || "",
                                }
                            } :
                            {
                                coverImage: null,
                            }),
                        ...((dataToSend.profileImagePublicId && dataToSend.profileImageUrl) ?
                            {
                                profileImage: {
                                    publicId: dataToSend.profileImagePublicId,
                                    url: profileImageUrl || userProfile.data?.profileImage?.url || "",
                                }
                            } :
                            {
                                profileImage: null
                            }),
                    }

                    if (profileImageUrl && dataToSend.profileImagePublicId) {
                        dispatch(setCurrentUserProfile({ publicId: dataToSend.profileImagePublicId, url: profileImageUrl }))
                    }

                    return data;
                })

                navigate(`/profile/${username}`);
            }
        } catch (err: unknown) {
            handleApiErrorNotification<UpdateUserProfile>(err, {
                setValidationError: setError
            })
        }
    }

    // update profile value
    useEffect(() => {
        reset({
            name: userProfile.data?.name,
            bio: userProfile.data?.bio,
            coverImagePublicId: userProfile.data?.coverImage?.publicId,
            coverImageUrl: userProfile.data?.coverImage?.url,
            profileImagePublicId: userProfile.data?.profileImage?.publicId,
            profileImageUrl: userProfile.data?.profileImage?.url
        })
    }, [userProfile.data, reset]);

    // check is pending
    if (userProfile.isPending) {
        return (
            <EditProfileSkeletonLoading />
        )
    }

    // display form
    return (
        <>
            {/* head */}
            <title>Edit your profile - Odiano</title>

            {/* profile image cropper */}
            {
                ((profileImageUpload.isCropping && profileImageUpload.fileData && profileImageUpload.fileData.length > 0 && profileImageUpload.fileData[0].blob?.original)) &&
                createPortal(
                    <ImageCropper aspect={1} imageUrl={profileImageUpload.fileData[0].url} setImageCroppedBlob={(blob: Blob) => profileImageUpload.setImageCroppedBlob(blob, 0)} setIsCropping={profileImageUpload.setIsCropping} key={`profile-image-cropper`} />,
                    document.body
                )
            }

            {/* cover image cropper */}
            {
                ((coverImageUpload.isCropping && coverImageUpload.fileData && coverImageUpload.fileData.length > 0 && coverImageUpload.fileData[0].blob?.original)) &&
                createPortal(
                    <ImageCropper aspect={3/1} imageUrl={coverImageUpload.fileData[0].url} setImageCroppedBlob={(blob: Blob) => coverImageUpload.setImageCroppedBlob(blob, 0)} setIsCropping={coverImageUpload.setIsCropping} key={`profile-image-cropper`} />,
                    document.body
                )
            }

            {/* form */}
            <div className={`w-full min-h-screen main-section-padding-top ${isSubmitting && "pointer-events-none"}`}>
                <form onSubmit={handleSubmit(update)} className="w-full h-full">
                    {/* header */}
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <GoBackIconButton />
                            <h1 className="text-2xl font-bold">
                                Edit Profile
                            </h1>
                        </div>
                        <button className={`w-18 h-9.5 rounded-full bg-white border border-white text-neutral-800 cursor-pointer duration-100 text-sm font-bold grid place-content-center ${!isSubmitting && "hover:bg-transparent hover:text-neutral-100"}`} disabled={isSubmitting} type="submit">
                            {
                                isSubmitting ?
                                    <div className="size-7 h-fit">
                                        <DotsLoader />
                                    </div>
                                    :
                                    <span>
                                        Save
                                    </span>
                            }
                        </button>
                    </div>

                    {/* cover image */}
                    <div className={`w-full relative`}>
                        <div
                            className={`cover-image-aspect bg-neutral-500 rounded-xl mt-5 overflow-hidden duration-100`}
                        >
                            {
                                coverImageUpload.fileData && coverImageUpload.fileData.length > 0 && coverImageUpload.fileData[0].blob?.edited &&
                                <img src={URL.createObjectURL(coverImageUpload.fileData[0].blob?.edited || coverImageUpload.fileData[0].blob?.original)} className="w-full h-full" />
                            }
                            {
                                (coverImageUrl && (!coverImageUpload.fileData || coverImageUpload.fileData.length === 0)) &&
                                <img src={coverImageUrl} className="w-full h-full" />
                            }
                        </div>

                        <div className={`w-full h-full absolute top-0 left-0 bottom-0 right-0 z-1  rounded-xl grid place-content-center duration-100 ${coverDragAndDrop.isDrag ? "bg-black/50" : "bg-black/40"}`} onDragEnter={coverDragAndDrop.handleDragEnter} onDragLeave={coverDragAndDrop.handleDragLeave} onDragOver={coverDragAndDrop.handleDragOver} onDrop={(e) => coverDragAndDrop.handleDrop(e, coverImageUpload.processFile)}>
                            <div className="w-fit flex items-center space-x-3">
                                {/* upload */}
                                <label htmlFor="inputCoverImage" className={`w-14 aspect-square rounded-full duration-100 grid place-content-center cursor-pointer ${coverDragAndDrop.isDrag ? "bg-neutral-950/80" : "bg-neutral-950/60 hover:bg-neutral-900/60 hover:text-neutral-50 "}`}>
                                    <Upload className="w-5" />
                                </label>
                                <input id="inputCoverImage" type="file" accept={`${DEFAULT_ALLOWED_IMAGE_TYPES.join(", ")}`} className="hidden" onChange={coverImageUpload.handleImageInput} />

                                {/* delete cover */}
                                {
                                    ((coverImageUpload.fileData && coverImageUpload.fileData.length > 0 && coverImageUpload.fileData[0].blob?.edited) || userProfile.data?.coverImage) &&
                                    <button type="button" className={`w-14 aspect-square rounded-full bg-neutral-950/60  duration-100 grid place-content-center cursor-pointer hover:bg-neutral-900/60 hover:text-neutral-50`} disabled={isSubmitting} onClick={() => coverImageUpload.removeFile(0,() => {
                                        setValue("coverImagePublicId", null);
                                        setValue("coverImageUrl", null);
                                    })}>
                                        <X />
                                    </button>
                                }
                            </div>
                        </div>

                        {/* profile */}
                        <div className={`absolute w-28 aspect-square left-6 -bottom-[25%] flex items-center justify-center p-1 bg-black rounded-full overflow-hidden z-2`} onDragEnter={profileDragAndDrop.handleDragEnter} onDragOver={profileDragAndDrop.handleDragOver} onDragLeave={profileDragAndDrop.handleDragLeave} onDrop={(e) => profileDragAndDrop.handleDrop(e, profileImageUpload.processFile)}>
                            <ProfileComponent data={
                                profileImageUpload.fileData && profileImageUpload.fileData.length > 0 && profileImageUpload.fileData[0].blob?.edited ?
                                    {
                                        url: URL.createObjectURL(profileImageUpload.fileData[0].blob.edited)
                                    }
                                    :
                                    userProfile.data?.profileImage
                            } />

                            <label htmlFor="inputProfileImage" className={`w-full h-full cursor-pointer absolute top-0 left-0 right-0 bottom-0 m-auto  hover:text-neutral-50 duration-100 grid place-content-center ${profileDragAndDrop.isDrag ? "hover:bg-black/80 bg-black/60" : "hover:bg-black/60 bg-black/40"}`}>
                                <Upload />
                            </label>

                            <input type="file" accept={`${DEFAULT_ALLOWED_IMAGE_TYPES.join(", ")}`} className="hidden" id="inputProfileImage" onChange={profileImageUpload.handleImageInput} />
                        </div>
                    </div>

                    {/* username input */}
                    <div className={`w-full mt-18`}>
                        <div className={`w-full rounded bg-black border p-1 pt-1.25 px-3 flex flex-col ${errors.name ? "border-red-500" : "focus-within:border-sky-500 border-neutral-600"} -space-y-1 group`}>
                            <label className={`text-sm ${errors.name ? "text-red-500" : "text-neutral-500 group-focus-within:text-sky-500"} duration-100`}>
                                Name
                            </label>
                            <input className="h-8 w-full default-input-text-behaviour" {...register("name")}></input>
                        </div>
                        {
                            errors.name &&
                            <span className="text-xs text-red-500">
                                {errors.name.message}
                            </span>
                        }
                    </div>

                    {/* bio */}
                    <div className="w-full mt-4">
                        <div className={`w-full col-span-1 rounded bg-black border ${(watch("bio")?.length > BIO_LENGTH.MAX || errors.bio) ? "border-red-500" : "border-neutral-600 focus-within:border-sky-500"} p-1 pt-2 px-3 flex flex-col group relative`}>
                            <label className={`text-sm ${(watch("bio")?.length > BIO_LENGTH.MAX || errors.bio) ? "text-red-500" : "text-neutral-500 focus-within:text-sky-500"} duration-100`}>
                                Bio
                            </label>
                            <textarea rows={4} className="w-full default-input-text-behaviour" {...register("bio")}></textarea>

                            <div className={`absolute top-3 right-5 text-xs ${watch("bio")?.length > BIO_LENGTH.MAX ? "text-red-500" : "text-neutral-400"}`}>
                                {watch("bio")?.length}/{BIO_LENGTH.MAX}
                            </div>
                        </div>
                        {
                            errors.bio &&
                            <span className="text-xs text-red-500">
                                {errors.bio.message}
                            </span>
                        }
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProfile;