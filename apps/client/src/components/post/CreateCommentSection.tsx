import { createPostCommentSchema, POST_COMMENT_CONTENT_LENGTH, type CreatePostCommentSchema } from "@connect/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { SmileIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

const CreateCommentSection = () => {
    const {
        handleSubmit,
        register,
        control,
        watch,
        formState: { errors }
    } = useForm<CreatePostCommentSchema>({
        mode: "onTouched",
        resolver: zodResolver(createPostCommentSchema)
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

    return (
        <form className="sticky top-0 left-0 w-full bg-neutral-950 border-y border-neutral-800 py-8 mt-10">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 shrink-0" />

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
                                (content.length > 1) &&
                                <span className={`${content.length > POST_COMMENT_CONTENT_LENGTH.MAX ? 'text-red-500' : 'text-neutral-200'} text-sm`}>
                                    {content.length}/{POST_COMMENT_CONTENT_LENGTH.MAX}
                                </span>
                            }
                            <button
                                className="px-4 py-2 rounded-full text-neutral-600 text-sm bg-neutral-100 hover:bg-transparent hover:text-neutral-100 border border-neutral-100 duration-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default CreateCommentSection;