import { BIO_LENGTH, updateUserProfile, type UpdateUserProfile, type UserProfileDTO } from "@connect/shared";
import GoBackIconButton from "../../components/common/GoBackIconButton";
import ProfileComponent from "../../components/social/Profile";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../../queries/userKeys";
import { getUserProfile } from "../../services/user.service";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { useEffect } from "react";
import EditProfileSkeletonLoading from "../../components/profile/EditProfileSkeletonLoading";
import { Upload } from "lucide-react";

const EditProfile = () => {
    const { username } = useParams();

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
        formState: { errors },
    } = useForm<UpdateUserProfile>({
        mode: "onTouched",
        resolver: zodResolver(updateUserProfile),

        values: {
            name: "",
            bio: "",
            coverImagePublicId: null,
            coverImageUrl: null,
            profileImagePublicId: null,
            profileImageUrl: null
        }
    })

    const update: SubmitHandler<UpdateUserProfile> = async () => {

    }

    // update profile value
    useEffect(() => {
        reset({
            bio: userProfile.data?.bio,
            name: userProfile.data?.name,
            profileImageUrl: userProfile.data?.profileImage?.url,
            profileImagePublicId: userProfile.data?.profileImage?.publicId,
            coverImagePublicId: null,
            coverImageUrl: null,
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
        <form onSubmit={handleSubmit(update)} className="w-full min-h-screen">
            {/* header */}
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <GoBackIconButton />
                    <h1 className="text-2xl font-bold">
                        Edit Profile
                    </h1>
                </div>
                <button className="w-18 h-9.5 rounded-full bg-white border border-white text-neutral-800 hover:bg-transparent hover:text-neutral-100 cursor-pointer duration-100 text-sm font-bold grid place-content-center" type="button">
                    Save
                </button>
            </div>

            {/* cover image */}
            <div className={`w-full cover-image-aspect bg-neutral-500 rounded-xl mt-5 relative`}>
                <div className="w-full h-full absolute top-0 left-0 bottom-0 right-0 z-1 bg-neutral-950/20 rounded-xl grid place-content-center">
                    <div className="w-fit flex items-center space-x-3">
                        <label htmlFor="inputCoverImage" className="w-14 aspect-square rounded-full bg-neutral-900/20 hover:bg-neutral-900/40 hover:text-neutral-50 duration-100 grid place-content-center cursor-pointer">
                            <Upload className="w-5"/>
                        </label>
                        <input id="inputCoverImage" type="file" accept="image/png, image/jpeg, image/webp" className="hidden"/>
                    </div>
                </div>

                {/* profile */}
                <div className={`absolute w-28 aspect-square left-6 -bottom-[25%] flex items-center justify-center p-1 bg-neutral-950 rounded-full overflow-hidden z-2`}>
                    <ProfileComponent data={userProfile.data?.profileImage} />

                    <label htmlFor="inputProfileImage" className="w-full h-full cursor-pointer absolute top-0 left-0 right-0 bottom-0 m-auto bg-neutral-950/40 hover:bg-neutral-950/60 hover:text-neutral-50 duration-100 grid place-content-center">
                        <Upload/>
                    </label>

                    <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" id="inputProfileImage"/>
                </div>
            </div>

            {/* username input */}
            <div className="w-full mt-18">
                <div className={`w-full rounded bg-neutral-950 border p-1 pt-1.25 px-3 flex flex-col ${errors.name ? "border-red-500" : "focus-within:border-sky-500 border-neutral-600"} -space-y-1 group`}>
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
                <div className={`w-full col-span-1 rounded bg-neutral-950 border ${(watch("bio")?.length > BIO_LENGTH.MAX || errors.bio) ? "border-red-500" : "border-neutral-600 focus-within:border-sky-500"} p-1 pt-2 px-3 flex flex-col group relative`}>
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
    );
};

export default EditProfile;