import { useEffect, useState } from "react"
import PillSwitch from "../input/PillSwitch";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createPostSchema, POST_CONTENT_LENGTH, type CreatePostSchema, type PostPublicId, type SuccessResponseData } from "@connect/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import DotsLoader from "../loader/DotsLoader";
import { api } from "../../libs/api";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";

type Props = {
    setShowCreatePostFormSection: React.Dispatch<React.SetStateAction<boolean>>
}

const PostFormSection = ({ setShowCreatePostFormSection }: Props) => {
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [postPublicId, setPostPublicId] = useState<string | null>(null);

    const currentUserUsername = useAppSelector((state) => state.auth.user?.username);

    // handle form
    const {
        handleSubmit,
        register,
        watch,
        setValue,
        setFocus,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreatePostSchema>({
        resolver: zodResolver(createPostSchema),
        mode: "onTouched",

        defaultValues: {
            media: null,
            isArchive: false,
            hideLikeAndViewCount: false,
            turnOffCommenting: false,
            visibility: "public",
        }
    })

    const onSubmit: SubmitHandler<CreatePostSchema> = async (data) => {
        try {
            console.log(data);

            const response = await api.post<SuccessResponseData<PostPublicId>>("/post/create", data);

            if (!response.data) {
                throw Error("Something went wrong");
            }

            setPostPublicId(response.data.data?.publicId || null);
            reset();
            setIsCreated(true);
        } catch (err: unknown) {
            handleApiErrorNotification<CreatePostSchema>(err, {
                setValidationError : setError
            })
        }
    }

    // handle post setting
    const hideLikeAndViewCount = watch("hideLikeAndViewCount");
    const turnOffCommenting = watch("turnOffCommenting");
    const handleToggle = (field: "hideLikeAndViewCount" | "turnOffCommenting") => {
        setValue(field, !watch(field), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    };

    // setting
    useEffect(() => {
        setFocus("content");
    }, [])

    return (
        <div className="w-screen h-screen fixed bg-neutral-950/80 top-0 left-0 z-25 flex justify-center items-center 2xl:items-start 2xl:py-32">
            {/* content */}
            <div className="w-[650px] h-fit bg-neutral-900 rounded-3xl overflow-hidden duration-100 z-22">
                {/* form */}
                <form onSubmit={handleSubmit(onSubmit)} className={`w-full p-10 h-full relative ${isCreated && "hidden"}`}>
                    {/* comming soon */}
                    {/* <div className="w-full h-24">
                        <label className="w-full h-full rounded-xl border border-neutral-400 border-dashed grid place-content-center text-xs text-neutral-300 cursor-pointer" htmlFor="media-input">
                            <span>Drag and drop photos or videos here, or click to select files. (optional)</span>
                        </label>
                        <input type="file" className="hidden" id="media-input" accept="image/*,video/*" />
                    </div> */}
                    
                    <div>
                        <div className="w-full relative">
                            <textarea className="mt-4 w-full h-40 border border-neutral-600 rounded-xl py-4 px-5 text-neutral-200 default-input-text-behaviour" placeholder="What's on your mind?" {...register("content")}></textarea>
                            <div className={`absolute bottom-3 right-3 text-sm ${watch("content")?.length > POST_CONTENT_LENGTH.MAX ? 'text-red-500' : 'text-neutral-100'}`}>
                                {watch("content")?.length}/{POST_CONTENT_LENGTH.MAX}
                            </div>
                        </div>
                        {
                            errors.content &&
                            <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
                        }
                    </div>

                    {/* comming soon */}
                    {/* <div className="flex flex-col space-y-2 mt-3">
                        <div className="flex items-center space-x-10">
                            <p className="h-fit">
                                Hide Like and view count on this post?
                            </p>
                            <PillSwitch checked={hideLikeAndViewCount} onToggle={() => handleToggle("hideLikeAndViewCount")} />
                        </div>
                        <div className="flex items-center space-x-10">
                            <p className="h-fit">
                                Turn off commenting
                            </p>
                            <PillSwitch checked={turnOffCommenting} onToggle={() => handleToggle("turnOffCommenting")} />
                        </div>
                    </div> */}

                    <div className="mt-10 flex items-center text-sm space-x-3">
                        <button className={`px-11 h-11 border border-white bg-white text-neutral-800 ${isSubmitting ? "" : "hover:bg-transparent hover:text-neutral-100"} duration-100 cursor-pointer rounded`} disabled={isSubmitting}>
                            {isSubmitting ? <DotsLoader /> : "Post"}
                        </button>
                        <button type="button" onClick={() => setShowCreatePostFormSection(false)} className="px-8 h-11 border border-white hover:bg-white hover:text-neutral-800 duration-100 cursor-pointer rounded">
                            Cancel
                        </button>
                    </div>
                </form>

                {/* sucess */}
                <div className={`w-full h-120 flex flex-col items-center justify-center px-6 ${!isCreated && "hidden"}`}>
                    <div className="flex justify-center">
                        <div className="bg-neutral-50 p-[2px] rounded-full">
                            <div className="flex items-center justify-center w-20 h-20 rounded-full  bg-neutral-900 text-neutral-50">
                                <Check size={40}/>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <div className="bg-clip-text text-transparent bg-linear-to-br from-neutral-700 to-neutral-50">
                            <h2 className="text-3xl font-bold">
                                Post Created!
                            </h2>
                        </div>

                        <p className="mt-3 text-sm text-neutral-200 leading-relaxed">
                            Your post has been successfully published and is now visible to your audience.
                        </p>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Link to={`${currentUserUsername}/post/${postPublicId}`} onClick={() => setShowCreatePostFormSection(false)}>
                            <button
                                className="w-40 rounded-lg bg-neutral-100 h-12 text-sm font-semibold text-neutral-900 border border-white hover:bg-transparent hover:text-neutral-200 duration-100 cursor-pointer"
                            >
                                View Post
                            </button>
                        </Link>

                        <button
                            className="w-48 rounded-lg bg-transparent h-12 text-sm font-semibold text-neutral-200 border border-white hover:bg-neutral-100 hover:text-neutral-800 duration-100 cursor-pointer" onClick={() => setIsCreated(false)}
                        >
                            Create Another Post
                        </button>
                    </div>
                </div>
            </div>

            {/* background to close section */}
            <div className="w-full h-full fixed top-0 left-0" onClick={() => setShowCreatePostFormSection(false)}></div>
        </div>
    )
}

export default PostFormSection;