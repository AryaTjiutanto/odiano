import { createPostCommentSchema, ERROR_RESPONSE_CODE, POST_COMMENT_CONTENT_LENGTH, type CreatePostCommentSchema } from "@connect/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { SmileIcon, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { api } from "../../libs/api";
import { notify } from "../../helpers/notify.helper";
import type { ForbiddenErrorResponse, TooManyRequestErrorResponse, ValidationErrorResponse } from "../../types/response";
import TooManyRequestCountDown from "../counter/TooManyRequestCountDown";
import DotsLoader from "../loader/DotsLoader";
import { useAppSelector } from "../../shared/hooks/useRedux";

type CreateCommentProps = {
    postId: string,
}

type ErrorResponse = ValidationErrorResponse | TooManyRequestErrorResponse | ForbiddenErrorResponse;

const CreateCommentSection = ({ postId }: CreateCommentProps) => {
    const currentUser = useAppSelector((state) => state.auth.user);

    //  handle form
    const {
        handleSubmit,
        register,
        control,
        formState: { errors, isSubmitting }
    } = useForm<CreatePostCommentSchema>({
        mode: "onTouched",
        resolver: zodResolver(createPostCommentSchema),

        defaultValues: {
            depth: 0,
            parentId: null,
            postId,
        }
    });

    // handle comment input
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const {
        ref: registerRef,
        ...contentField
    } = register("content");

    const content = useWatch({
        control,
        name: "content"
    })

    useEffect(() => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }, [content])

    const onSubmit: SubmitHandler<CreatePostCommentSchema> = async (data) => {
        try {
            await api.post("/post/comment/create", data);

            notify.success({ title: "Comment posted", "description": "Your comment has been posted successfully." });
        } catch (err: any) {
            const error = err.response?.data as ErrorResponse;

            if (error.code == ERROR_RESPONSE_CODE.tooManyRequests) {
                if (!error.errors) return;

                notify.error({ title: "Too many request", "element": <TooManyRequestCountDown show="auto" timeLeftMs={error.errors?.timeLeftMs} /> })
                return;
            }

            if (error.code == ERROR_RESPONSE_CODE.validationError) {
                notify.error({
                    title: "Invalid comment",
                    description: "Please check your input and try again."
                });
                return;
            }

            if (error.code == ERROR_RESPONSE_CODE.forbidden) {
                notify.error({
                    title: "Comment limit reached",
                    description: error.message
                })

                return;
            }

            notify.error({ title: "An Error occured", "description": "Something went wrong" });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sticky top-0 left-0 w-full bg-neutral-950 border-y border-neutral-800 py-8 mt-10">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 shrink-0 overflow-hidden grid place-content-center">
                    {
                        currentUser?.profileImage ?
                        <img src={currentUser.profileImage.url} className="w-full h-full"/>
                        :
                        <User/>
                    }
                </div>

                <div className="flex-1">
                    <textarea
                        {
                        ...contentField
                        }
                        ref={(element) => {
                            registerRef(element);
                            textAreaRef.current = element;
                        }}
                        placeholder="Write a comment..."
                        className={`w-full resize-none text-lg bg-transparent  placeholder:text-neutral-500 focus:outline-none ${errors.content ? 'text-red-500' : 'text-white'}`}
                    />

                    <div className="flex justify-between mt-1">
                        <div className="flex items-center space-x-3">
                            <button className="cursor-pointer">
                                <SmileIcon className="w-5" />
                            </button>
                            <button className="w-6 h-5 border border-neutral-2 grid place-content-center font-semibold text-[8px] rounded cursor-pointer">
                                GIF
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            {
                                content && (content.length > 1) &&
                                <span className={`${content.length > POST_COMMENT_CONTENT_LENGTH.MAX ? 'text-red-500' : 'text-neutral-200'} text-sm`}>
                                    {content.length}/{POST_COMMENT_CONTENT_LENGTH.MAX}
                                </span>
                            }
                            <button
                                className={`w-27 h-10 rounded-full text-neutral-600 text-sm bg-neutral-100 border border-neutral-100 duration-100 transition-colors cursor-pointer grid place-content-center ${isSubmitting ? '' : 'hover:bg-transparent hover:text-neutral-100'}`}
                                disabled={isSubmitting}
                            >
                                <span className={`${isSubmitting && "hidden"}`}>
                                    Comment
                                </span>
                                <div className={`text-neutral-900 ${isSubmitting ? '' : 'hidden'}`}>
                                    <DotsLoader />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default CreateCommentSection;