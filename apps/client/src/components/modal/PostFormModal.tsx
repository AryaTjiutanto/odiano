import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useForm, type SubmitHandler } from "react-hook-form";
import { ALLOWED_MEDIA_PROVIDERS, createPostSchema, MEDIA_ASPECT_RATIO, POST_MAX_MEDIA, type CreatedDocumentId, type CreatePostSchema, type PostMedia, type SuccessResponseData, type UserProfileDTO } from "@odiano/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import DotsLoader from "../loader/DotsLoader";
import { api } from "../../libs/api";
import { Check, ChevronLeft, ChevronRight, Crop, GalleryVerticalEnd, Plus, X } from "lucide-react";
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
import PostContentEditor, { type PostContentEditorRef } from "../post/PostContentEditor";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { postKeys } from "../../queries/postKeys";
import { addPostToUserPostCache } from "../../helpers/cache/postCache.helper";
import type { InfiniteQueryPostDTO } from "../../types/post.type";
import { userKeys } from "../../queries/userKeys";
import { updateUserTotalPosts } from "../../helpers/cache/userCache.helper";
import { handleAppErrorNotification } from "../../helpers/errors/appError.helper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

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

    // post content editor ref
    const postContentEditorRef = useRef<PostContentEditorRef | null>(null);

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

    // reset editor
    const resetEditor = () => {
        setIsCreated(false);
        fileUpload.reset();
        postContentEditorRef.current?.reset();
    }

    // media swiper
    const swiperRef = useRef<SwiperType | null>(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const updateSwiperState = (swiper: SwiperType) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <>
            <div className="w-screen h-screen fixed bg-black/80 top-0 left-0  z-26 flex justify-center items-center 2xl:items-start 2xl:py-32" onDrop={(e) => dragAndDrop.handleDrop(e, (data) => {
                fileUpload.processFile(data)
                if (swiperRef.current) updateSwiperState(swiperRef.current);
            })} onDragOver={dragAndDrop.handleDragOver} onDragEnter={dragAndDrop.handleDragEnter} onDragLeave={dragAndDrop.handleDragLeave}>
                {/* content */}
                <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] sm:w-[440px] lg:w-[500px] h-fit max-h-[90%] overflow-y-auto bg-neutral-950 rounded-xl overflow-hidden duration-100 z-22 flex flex-col">
                    <div className="w-full h-14 sm:h-12 xl:h-10 border-b border-neutral-800 flex items-center justify-between px-4 text-sm text-neutral-300 bg-neutral-900">
                        <div className="flex items-center">
                            {
                                !isSubmitting &&
                                <button type="button" className="w-8 aspect-square rounded-full bg-transparent hover:bg-red-500/10 text-neutral-300 hover:text-red-500 grid place-content-center duration-100 cursor-pointer -translate-x-1.5" onClick={handleCancel}>
                                    <X className="w-5 z-1 relative" />
                                </button>
                            }
                            {
                                isCreated ?
                                    <h1 className="font-bold">
                                        Post Created!
                                    </h1>
                                    :
                                    <h1 className="font-bold">
                                        New Post
                                    </h1>
                            }
                        </div>

                        {
                            !isCreated &&
                            <button type="submit"
                                className={`duration-100 flex items-center justify-center relative font-semibold ${isSubmitting ? "cursor-progress" : "text-sky-400 hover:text-sky-600 cursor-pointer"}`}
                            >
                                {
                                    isSubmitting ?
                                        <div className="flex items-center text-neutral-100">
                                            <DotsLoader size="small" />
                                        </div>
                                        :
                                        <span>
                                            Share
                                        </span>
                                }
                            </button>
                        }
                    </div>

                    {/* form */}
                    <div className={`${isCreated && "hidden"} relative flex flex-col`}>
                        <div className={`w-full flex-1 h-fit sm:h-full`}>
                            {/* image input */}
                            <div className={`w-full h-52 sm:h-40 md:h-45 overflow-y-hidden border ${dragAndDrop.isDrag ? "border-sky-500" : "border-transparent"} relative`}>
                                {
                                    (fileUpload.fileData && fileUpload.fileData.length > 0) ?
                                        <>
                                            <Swiper
                                                className="w-full h-full"
                                                slidesPerView={1}
                                                breakpoints={{
                                                    450: {
                                                        slidesPerView: 2,
                                                    },
                                                }}
                                                onSwiper={(swiper) => {
                                                    swiperRef.current = swiper;
                                                    updateSwiperState(swiper);
                                                }}
                                                onSlideChange={updateSwiperState}
                                            >
                                                {fileUpload.fileData?.map((file, index) => {
                                                    if (!file.blob?.original) return null;

                                                    const blobUrl = URL.createObjectURL(
                                                        file.blob.edited || file.blob.original
                                                    );

                                                    return (
                                                        <SwiperSlide
                                                            key={`file-${file.id}`}
                                                            className="h-full"
                                                        >
                                                            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                                                                {file.type === "image" && (
                                                                    <>
                                                                        {/* Background */}
                                                                        <img
                                                                            src={blobUrl}
                                                                            alt=""
                                                                            className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60"
                                                                        />

                                                                        {/* Actual image */}
                                                                        <img
                                                                            src={blobUrl}
                                                                            alt="file"
                                                                            className="relative max-w-full max-h-full w-auto h-auto object-contain"
                                                                        />
                                                                    </>
                                                                )}

                                                                {file.type === "video" && (
                                                                    <>
                                                                        {/* Background */}
                                                                        <video
                                                                            src={fileUpload.fileData?.[index]?.url}
                                                                            className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60 pointer-events-none"
                                                                            muted
                                                                            playsInline
                                                                        />

                                                                        {/* Actual video */}
                                                                        <video
                                                                            src={fileUpload.fileData?.[index]?.url}
                                                                            className="relative max-w-full max-h-full w-auto h-auto"
                                                                            controls
                                                                        />
                                                                    </>
                                                                )}

                                                                {!isSubmitting && (
                                                                    <div className="absolute top-1 right-1 flex items-center space-x-1">
                                                                        {file.type === "image" && (
                                                                            <button
                                                                                type="button"
                                                                                className="w-8 h-8 rounded-full bg-neutral-900/80 hover:bg-neutral-900/60 duration-100 text-neutral-50 hover:text-sky-500 grid place-content-center cursor-pointer"
                                                                                onClick={() =>
                                                                                    handleEditImage(
                                                                                        file.blob?.original,
                                                                                        file.editData,
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Crop size={18} />
                                                                            </button>
                                                                        )}

                                                                        <button
                                                                            type="button"
                                                                            className="w-8 h-8 rounded-full bg-neutral-900/80 hover:bg-neutral-900/60 duration-100 text-neutral-50 hover:text-rose-500 grid place-content-center cursor-pointer"
                                                                            onClick={() => handleRemoveFile(index)}
                                                                        >
                                                                            <X size={20} />
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {fileUpload.uploadProgress[file.id] && (
                                                                    <div className="p-1 px-2 text-[13px] rounded-md bg-black/60 absolute top-2 left-2 duration-100">
                                                                        {fileUpload.uploadProgress[file.id] === 100
                                                                            ? "Uploaded"
                                                                            : `${fileUpload.uploadProgress[file.id]}%`}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </SwiperSlide>
                                                    );
                                                })}

                                                {(fileUpload.isMediaNotFull() && !isSubmitting) && (
                                                    <SwiperSlide className="h-full">
                                                        <label
                                                            htmlFor="media-input"
                                                            className={`w-full h-full grid place-content-center text-neutral-500 cursor-pointer duration-100 hover:border-neutral-400 hover:text-neutral-300 ${dragAndDrop.isDrag ? "bg-gray-900" : "bg-[#101010]"}`}
                                                        >
                                                            <div className={`w-10 h-10 grid place-content-center rounded-full ${dragAndDrop.isDrag ? "text-sky-500 bg-gray-900" : "bg-neutral-900"}`}>
                                                                <Plus />
                                                            </div>
                                                        </label>
                                                    </SwiperSlide>
                                                )}
                                            </Swiper>

                                            <button
                                                type="button"
                                                onClick={() => swiperRef.current?.slidePrev()}
                                                disabled={isBeginning}
                                                className={`absolute top-0 bottom-0 my-auto left-2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 duration-100 text-white ${isBeginning
                                                    ? "opacity-0 pointer-events-none"
                                                    : "opacity-100 cursor-pointer"
                                                    }`}
                                            >
                                                <ChevronLeft />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => swiperRef.current?.slideNext()}
                                                disabled={isEnd}
                                                className={`absolute top-0 bottom-0 my-auto right-2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 duration-100 text-white ${isEnd
                                                    ? "opacity-0 pointer-events-none"
                                                    : "opacity-100 cursor-pointer"
                                                    }`}
                                            >
                                                <ChevronRight />
                                            </button>
                                        </>
                                        :
                                        <>
                                            <label className={`w-full h-full flex flex-col items-center justify-center text-xs text-neutral-300 cursor-pointer duration-100 p-5 text-center group relative ${dragAndDrop.isDrag ? "bg-gray-900" : "bg-[#101010]"}`} htmlFor="media-input">
                                                <GalleryVerticalEnd className={`w-7 ${dragAndDrop.isDrag ? "text-sky-500" : ""}`} />
                                                <span className={`${dragAndDrop.isDrag ? "inline-block" : "hidden"} text-sky-500 font-semibold text-sm mt-1`}>Drop your Files</span>

                                                <span className={`${dragAndDrop.isDrag && "hidden"} mt-2 text-sm`}>
                                                    Drag images or videos here - <b className="">optional</b>
                                                </span>
                                                <div className={`w-36 h-8 mt-2 rounded-lg grid place-content-center bg-white border border-white hover:bg-transparent hover:text-white duration-100 text-neutral-900 font-medium text-[10px] cursor-pointer group-hover:bg-transparent group-hover:text-white ${dragAndDrop.isDrag ? "hidden" : ""}`}>
                                                    Select from computer
                                                </div>
                                            </label>
                                        </>
                                }
                            </div>
                            <input type="file" className="hidden" id="media-input" accept="image/png, image/webp,image/jpeg,video/mp4,video/mkv" multiple onChange={handleImageInput} />

                            {/* text input */}
                            <div className="w-full py-4">
                                <PostContentEditor ref={postContentEditorRef} errorMessage={errors.content?.message} setContent={(content: string) => setValue("content", content, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                })} setHashtags={(hashtags: string[] | null) => setValue("hashtags", hashtags, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                })} />
                            </div>
                        </div>
                    </div>

                    {/* sucess */}
                    <div className={`w-full h-full py-10 sm:h-120 flex flex-col items-center justify-center px-8 sm:px-6 ${!isCreated && "hidden"}`}>
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
                            <Link to={`${currentUserUsername}/post/${postPublicId}`} onClick={postForm.close} className="w-full sm:w-40 rounded-lg bg-neutral-100 h-12 text-sm font-semibold text-neutral-900 border border-white hover:bg-transparent hover:text-neutral-200 duration-100 cursor-pointer grid place-content-center">
                                View Post
                            </Link>

                            <button type="button"
                                className="w-full sm:w-48 rounded-lg bg-transparent h-12 text-sm font-semibold text-neutral-200 border border-white hover:bg-neutral-100 hover:text-neutral-800 duration-100 cursor-pointer" onClick={resetEditor}
                            >
                                Create Another Post
                            </button>
                        </div>
                    </div>
                </form>

                {/* background to close section */}
                <div className="w-full h-full fixed top-0 left-0" onClick={() => handleCloseForm()}></div>
            </div>
        </>
    )
}

export default PostFormModal;