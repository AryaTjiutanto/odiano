import { createPostCommentSchema, ERROR_RESPONSE_CODE, POST_COMMENT_CONTENT_LENGTH, type CreatePostCommentSchema, type PostCommentDTO, type PostDTO } from "@connect/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { SmileIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import DotsLoader from "../../loader/DotsLoader";
import { useAppSelector } from "../../../hooks/useRedux";
import Profile from "../../social/Profile";
import { useMutation } from "@tanstack/react-query";
import useSetQueryDataHandler from "../../../hooks/useSetQueryDataHandler";
import { Link, useParams } from "react-router-dom";
import { postKeys } from "../../../queries/postKeys";
import type { CreateCommentMutationParams } from "../../../types/post.type";
import { createComment } from "../../../services/post.service";
import { addToComment, decreaseCommentCount, increaseCommentCount, removeComment, updateToPostedCommentData } from "../../../helpers/cache/postCache.helper";
import { handleApiErrorNotification } from "../../../helpers/errors/apiError.helper";

type CreateCommentProps = {
    postId: string,
}

const CreateCommentSection = ({ postId }: CreateCommentProps) => {
    const currentUser = useAppSelector((state) => state.auth.user);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const { postPublicId } = useParams();

    //  handle form
    const {
        handleSubmit,
        register,
        control,
        reset,
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
        handleMutation(data);
    }

    // comment mutation
    const setQueryDataHandler = useSetQueryDataHandler();

    const currentUserCommentQueryKey = postKeys.currentUserComments(postId);
    const postQueryKey = postPublicId && postKeys.detail(postPublicId);

    const commentMutation = useMutation({
        mutationFn: createComment,

        onMutate: ({ commentId, data }: CreateCommentMutationParams) => {
            // increase post comment count
            if (postQueryKey) {
                setQueryDataHandler<PostDTO>(postQueryKey, (oldData) => increaseCommentCount(oldData));
            }

            // add new comment to the list
            setQueryDataHandler<PostCommentDTO[]>(currentUserCommentQueryKey, (oldData) => addToComment({commentId, data}, oldData, currentUser))
        },

        onSuccess: (newId, { commentId }: CreateCommentMutationParams) => setQueryDataHandler<PostCommentDTO[]>(currentUserCommentQueryKey, (oldData) => updateToPostedCommentData(oldData, commentId, newId)),

        onError: (_err, { commentId }: CreateCommentMutationParams) => {
            // decrease post comment count
            if(postQueryKey) {
                setQueryDataHandler<PostDTO>(postQueryKey, (oldData) => decreaseCommentCount(oldData))
            }

            // remove new comment from the list 
            setQueryDataHandler<PostCommentDTO[]>(currentUserCommentQueryKey, (oldData) => removeComment(oldData, commentId))
        },
    })


    const handleMutation = async (data: CreatePostCommentSchema) => {
        if(!currentUser) return;

        try {
            reset();

            const commentId = `temp:${crypto.randomUUID()}`;
            await commentMutation.mutateAsync({ commentId, data });
        } catch (err: unknown) {
            handleApiErrorNotification(err, {
                notifications : {
                    [ERROR_RESPONSE_CODE.forbidden] : {
                        title : "Comment limit reached",
                    }
                }
            })
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="w-full sticky top-0 left-0 bg-neutral-950 border-y border-neutral-800 py-8 grid place-content-center mt-10">
                <h1>
                    <Link to="/signin" className="text-sky-500 underline hover:text-sky-400 duration-100">
                        Sign in
                    </Link>{" "}
                    or{" "}
                    <Link to="/signup" className="text-sky-500 underline hover:text-sky-400 duration-100">
                        create an account
                    </Link>{" "}
                    to join the conversation.
                </h1>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="sticky top-0 left-0 w-full bg-neutral-950 border-y border-neutral-800 py-8 mt-10">
            <div className="flex gap-4">
                <div className="w-12 h-12">
                    <Profile data={currentUser?.profileImage} />
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