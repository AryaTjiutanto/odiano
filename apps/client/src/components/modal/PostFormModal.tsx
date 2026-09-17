import { useEffect, useState, type ChangeEvent } from "react"
import { useForm, type SubmitHandler } from "react-hook-form";
import { ALLOWED_MEDIA_PROVIDERS, createPostSchema, MEDIA_ASPECT_RATIO, POST_MAX_MEDIA, type CreatedDocumentId, type CreatePostSchema, type PostMedia, type SuccessResponseData, type UserProfileDTO } from "@odiano/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import DotsLoader from "../loader/DotsLoader";
import { api } from "../../libs/api";
import { Check, Crop, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import { usePostForm } from "../../providers/PostFormProvider";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import useFileUpload from "../../hooks/useFileUpload";
import { DEFAULT_ALLOWED_IMAGE_TYPES, DEFAULT_ALLOWED_VIDEO_TYPES } from "../../consts/file.const";
import { useConfirmationModal } from "../../providers/ConfirmationModalProvider";
import { useImageEditor } from "../../providers/ImageEditorProvider";
import type { FileEditData } from "../../types/file.type";
import PostContentEditor from "../post/PostContentEditor";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { postKeys } from "../../queries/postKeys";
import { addPostToUserPostCache } from "../../helpers/cache/postCache.helper";
import type { InfiniteQueryPostDTO } from "../../types/post.type";
import { userKeys } from "../../queries/userKeys";
import { updateUserTotalPosts } from "../../helpers/cache/userCache.helper";
import { handleAppErrorNotification } from "../../helpers/errors/appError.helper";

const POST_ASSETS_ALLOWED_TYPES = DEFAULT_ALLOWED_IMAGE_TYPES.concat(DEFAULT_ALLOWED_VIDEO_TYPES);

const PostFormModal = () => {
    const setQueryDataHandler = useSetQueryDataHandler();

    const imageEditor = useImageEditor();
    const confirmationModal = useConfirmationModal();

    const postForm = usePostForm();
    const dragAndDrop = useDragAndDrop();
    const fileUpload = useFileUpload({
        allowedTypes: POST_ASSETS_ALLOWED_TYPES,
        type: "post-media",
        maximumFiles: POST_MAX_MEDIA,
    });

    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [postPublicId, setPostPublicId] = useState<string | null>(null);

    const currentUserUsername = useAppSelector((state) => state.auth.user?.username);

    // handle form
    const {
        handleSubmit,
        watch,
        setFocus,
        setError,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<CreatePostSchema>({
        resolver: zodResolver(createPostSchema),
        mode: "onTouched",

        defaultValues: {
            media: null,
            hideLikeAndViewCount: false,
            turnOffCommenting: false,
            visibility: "public",
        }
    })

    const onSubmit: SubmitHandler<CreatePostSchema> = async (data) => {
        try {
            // upload media
            let media: PostMedia[] | null = null;
            if (fileUpload.fileData && fileUpload.fileData.length > 0) {
                const uploadedFile = await fileUpload.uploadFile();
                if (!Array.isArray(uploadedFile)) {
                    throw new Error("Something went wrong");
                }

                const uploadedMedia = uploadedFile.map((file, index) => {
                    if (!file?.uploaded) return null;

                    return {
                        aspectRatio: file.editData?.aspectRatio || MEDIA_ASPECT_RATIO["7:5"],
                        provider: ALLOWED_MEDIA_PROVIDERS.CLOUDINARY,
                        type: file.type,
                        order: index,
                        source: {
                            url: file.uploaded.url,
                            publicId: file.uploaded.publicId,
                        }
                    }
                })

                media = uploadedMedia.filter((data) => data !== null);
            }

            // create post
            const payload = {
                ...data,
                media,
            }
            
            const response = await api.post<SuccessResponseData<CreatedDocumentId>>("/post/create", payload);

            if (!response.data || !response.data.data?.id) {
                throw Error("Something went wrong");
            }

            setPostPublicId(response.data.data.publicId || null);
            reset();
            setIsCreated(true);

            // add post to cache
            setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(currentUserUsername || ""), (oldData) => addPostToUserPostCache(oldData, {
                commentCount: 0,
                content: data.content,
                createdAt: new Date(),
                hashtags: data.hashtags,
                hideLikeAndViewCount: data.hideLikeAndViewCount,
                id: response.data.data?.id || "",
                publicId: response.data.data?.publicId || "",
                isLiked: false,
                likeCount: 0,
                media: media && media.map((data) => ({
                    ...data,
                    source: {
                        publicId: data.source.publicId,
                        url: data.source.url.replace(/temp\//, ""),
                    }
                })),
                turnOffCommenting: data.turnOffCommenting,
                visibility: data.visibility,
            }))

            // increase user total posts
            setQueryDataHandler<UserProfileDTO>(userKeys.profile(currentUserUsername || ""), (oldData) => updateUserTotalPosts(oldData, 1, "increase"))
        } catch (err: unknown) {
            handleApiErrorNotification<CreatePostSchema>(err, {
                setValidationError: setError
            })
        }
    }

    const handleCancel = async () => {
        handleCloseForm("You will not be able to recover this post if you cancel it.");
    }

    const handleCloseForm = async (description: string = "You will not be able to recover this post if you cancel it.") => {
        if (isSubmitting) return;

        if (((!fileUpload.fileData || fileUpload.fileData.length == 0) && watch("content")?.length <= 0) || isCreated) {
            postForm.close();
            return;
        }

        const confirmationResult = await confirmationModal.confirm("Are you sure?", description, "Yes, I'm sure", "Cancel");

        if (confirmationResult) {
            postForm.close();
        }
    }

    const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
        try {
            if (isSubmitting) return;
    
            fileUpload.handleImageInput(e);
        } catch (err) {
            handleAppErrorNotification(err);
        }
    }

    // handle post setting
    // comming soon
    // const hideLikeAndViewCount = watch("hideLikeAndViewCount");
    // const turnOffCommenting = watch("turnOffCommenting");
    // const handleToggle = (field: "hideLikeAndViewCount" | "turnOffCommenting") => {
    //     setValue(field, !watch(field), {
    //         shouldDirty: true,
    //         shouldTouch: true,
    //         shouldValidate: true,
    //     })
    // };

    // edit image
    const handleEditImage = async (blob: Blob | undefined | null, editData: FileEditData | undefined, fileIndex: number) => {
        if (!blob || isSubmitting) return;

        const result = await imageEditor.edit(blob, editData, {
            aspectRatio: MEDIA_ASPECT_RATIO["original"],
            allowAspectRatioChange: true,
        });

        if (!result) return;

        fileUpload.setImageCroppedBlob(result?.blob || blob, result?.editData, fileIndex);
    }

    const handleRemoveFile = (index: number) => {
        if (isSubmitting) return;

        fileUpload.removeFile(index);
    }

    // setting
    useEffect(() => {
        setFocus("content");
    }, [setFocus])

    // unload effect
    useEffect(() => {
        if (!isDirty && (!fileUpload.fileData || fileUpload.fileData.length == 0)) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            return "";
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }

    }, [fileUpload.fileData, isDirty])

    return (
        <>
            <div className="w-screen h-screen fixed bg-black/50 top-0 left-0 z-25 flex justify-center items-center 2xl:items-start 2xl:py-32" onDrop={(e) => dragAndDrop.handleDrop(e, fileUpload.processFile)} onDragOver={dragAndDrop.handleDragOver} onDragEnter={dragAndDrop.handleDragEnter} onDragLeave={dragAndDrop.handleDragLeave}>
                {/* content */}
                <div className="w-full sm:w-[500px] md:w-[600px] h-full sm:h-fit bg-black sm:bg-neutral-950 rounded-3xl overflow-hidden duration-100 z-22 flex flex-col">
                    {/* form */}
                    <form onSubmit={handleSubmit(onSubmit)} className={`w-full p-8 sm:p-10 h-fit sm:h-full relative ${isCreated && "hidden"}`}>
                        <div className="flex items-center space-x-3 mb-6 sm:hidden">
                            <button className="" onClick={postForm.close}>
                                <X className="size-9" />
                            </button>
                            <h1 className="text-3xl font-bold sm:hidden">
                                Create Post
                            </h1>
                        </div>

                        {/* image input */}
                        {
                            (fileUpload.fileData && fileUpload.fileData.length > 0) ?
                                <div className="w-full grid grid-cols-3 gap-5">
                                    {
                                        fileUpload.fileData?.map((file, index) => {
                                            if (file.blob?.original) {
                                                return (
                                                    <div key={file.id} className="w-full relative bg-neutral-900 rounded-xl flex justify-center overflow-hidden" style={{ aspectRatio: MEDIA_ASPECT_RATIO["7:5"] }}>
                                                        {file.type == "image" &&
                                                            <>
                                                                <img src={URL.createObjectURL( file.blob.edited || file.blob.original)} alt="file" className="h-full w-fit" />
                                                            </>
                                                        }
                                                        {
                                                            file.type == "video" &&
                                                            <video src={fileUpload.fileData?.[index]?.url} className="h-full w-fit" />
                                                        }

                                                        <div className="absolute top-1 right-1 flex items-center space-x-1">
                                                            {
                                                                file.type == "image" &&
                                                                <button type="button" className="w-8 h-8 rounded-full bg-neutral-900/80 hover:bg-neutral-900/60 duration-100 text-neutral-50 hover:text-sky-500 grid place-content-center cursor-pointer" onClick={() => handleEditImage(file.blob?.original, file.editData, index)}>
                                                                    <Crop size={18} />
                                                                </button>
                                                            }
                                                            <button type="button" className="w-8 h-8 rounded-full bg-neutral-900/80 hover:bg-neutral-900/60 duration-100 text-neutral-50 hover:text-rose-500 grid place-content-center cursor-pointer" onClick={() => handleRemoveFile(index)}>
                                                                <X size={20} />
                                                            </button>
                                                        </div>

                                                        {
                                                            fileUpload.uploadProgress[file.id] &&
                                                            <div className="p-1 px-2 text-[13px] rounded-md bg-black/60 absolute top-2 left-2 duration-100">
                                                                {
                                                                    fileUpload.uploadProgress[file.id] == 100 ?
                                                                    "Uploaded"
                                                                    :
                                                                    `${fileUpload.uploadProgress[file.id]}%`
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                    {
                                        fileUpload.isMediaNotFull() &&
                                        <label htmlFor="media-input" className={`w-full h-full grid place-content-center text-neutral-500 cursor-pointer duration-100 border border-neutral-500 border-dashed rounded-xl hover:border-neutral-400 hover:text-neutral-400 ${isSubmitting && "pointer-events-none cursor-not-allowed"}`} style={{ aspectRatio: MEDIA_ASPECT_RATIO["7:5"] }}>
                                            <div className="w-10 h-10 bg-neutral-900 grid place-content-center rounded-full">
                                                <Plus />
                                            </div>
                                        </label>
                                    }
                                </div>
                                :
                                <div className={`w-full h-24`}>
                                    <label className={`w-full h-full rounded-xl border border-dashed grid place-content-center text-xs text-neutral-300 cursor-pointer duration-100 p-5 text-center ${dragAndDrop.isDrag ? "border-sky-500" : "border-neutral-500"}`} htmlFor="media-input">
                                        <span className={`${dragAndDrop.isDrag && "hidden"}`}>Drag and drop photos or videos here, or click to select files. (optional)</span>
                                        <span className={`${dragAndDrop.isDrag ? "inline-block" : "hidden"} text-sky-500`}>Drop your Files</span>
                                    </label>
                                </div>
                        }
                        <input type="file" className="hidden" id="media-input" accept="image/png, image/webp,image/jpeg,video/mp4,video/mkv" multiple onChange={handleImageInput} />

                        {/* text input */}
                        <PostContentEditor errorMessage={errors.content?.message} setContent={(content: string) => setValue("content", content, {
                            shouldDirty: true,
                            shouldTouch: true,
                        })} setHashtags={(hashtags: string[] | null) => setValue("hashtags", hashtags, {
                            shouldDirty: true,
                            shouldTouch: true,
                        })} />

                        {/* commming soon */}
                        {/* <div className="flex flex-col space-y-2 mt-3">
                        <div className="flex items-center space-x-10">
                            <p className="h-fit">
                                Hide Like count on this post?
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

                        <div className="w-full mt-10 flex flex-col sm:flex-row items-center text-base sm:text-sm gap-3">
                            <button className={`w-full sm:w-fit px-11 h-14 sm:h-11 border border-white bg-white text-neutral-800 ${isSubmitting ? "" : "hover:bg-transparent hover:text-neutral-100"} duration-100 cursor-pointer rounded`} disabled={isSubmitting}>
                                {isSubmitting ? <DotsLoader /> : "Post"}
                            </button>
                            {
                                !isSubmitting &&
                                <button type="button" onClick={handleCancel} className="w-full sm:w-fit px-8 h-14 sm:h-11 border border-white hover:bg-white hover:text-neutral-800 duration-100 cursor-pointer rounded">
                                    Cancel
                                </button>
                            }
                        </div>
                    </form>

                    {/* sucess */}
                    <div className={`w-full h-full sm:h-120 flex flex-col items-center justify-center px-8 sm:px-6 ${!isCreated && "hidden"}`}>
                        <div className="flex justify-center">
                            <div className="bg-neutral-50 p-[2px] rounded-full">
                                <div className="flex items-center justify-center w-20 h-20 rounded-full  bg-neutral-950 text-neutral-50">
                                    <Check size={40} />
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

                        <div className="w-full sm:w-fit mt-8 flex flex-col sm:flex-row gap-3">
                            <Link to={`${currentUserUsername}/post/${postPublicId}`} onClick={postForm.close}>
                                <button
                                    className="w-full sm:w-40 rounded-lg bg-neutral-100 h-12 text-sm font-semibold text-neutral-900 border border-white hover:bg-transparent hover:text-neutral-200 duration-100 cursor-pointer"
                                >
                                    View Post
                                </button>
                            </Link>

                            <button
                                className="w-full sm:w-48 rounded-lg bg-transparent h-12 text-sm font-semibold text-neutral-200 border border-white hover:bg-neutral-100 hover:text-neutral-800 duration-100 cursor-pointer" onClick={() => setIsCreated(false)}
                            >
                                Create Another Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* background to close section */}
                <div className="w-full h-full fixed top-0 left-0" onClick={() => handleCloseForm()}></div>
            </div>
        </>
    )
}

export default PostFormModal;