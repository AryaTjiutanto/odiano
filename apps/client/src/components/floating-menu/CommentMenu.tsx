import type { PostCommentDTO, PostDTO } from "@odiano/shared";
import { useAppSelector } from "../../hooks/useRedux";
import FloatingMenu from "./FloatingMenu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import MenuItem from "./MenuItem";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { deleteComment } from "../../services/post.service";
import { useMutation } from "@tanstack/react-query";
import { postKeys } from "../../queries/postKeys";
import { decreaseCommentCount, increaseCommentCount, removeComment } from "../../helpers/cache/postCache.helper";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import { useConfirmationModal } from "../../providers/ConfirmationModalProvider";
import { notify } from "../../helpers/notification/notify.helper";

type Props = {
    postId : string,
    postPublicId : string | undefined,
    authorId : string,
    commentId : string
}

const CommentMenu = ({ postPublicId, postId, commentId, authorId }: Props) => {
    const confirmationModal = useConfirmationModal();
    const setQueryDataHandler = useSetQueryDataHandler();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const user = useAppSelector(state => state.auth.user);

    if (!isAuthenticated || !user || !postPublicId) return;

    if (user.id !== authorId) return;

    // delete comment
    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,

        onMutate: () => {
            setQueryDataHandler<PostCommentDTO[]>(postKeys.currentUserComments(postId), (oldData) => removeComment(oldData, commentId));

            setQueryDataHandler<PostDTO>(postKeys.detail(postPublicId), (oldData) => decreaseCommentCount(oldData));
        },

        onError: () => {
            setQueryDataHandler<PostCommentDTO[]>(postKeys.currentUserComments(postId), (oldData) => removeComment(oldData, commentId));
            setQueryDataHandler<PostDTO>(postKeys.detail(postPublicId), (oldData) => increaseCommentCount(oldData));
        }
    })

    const handleDeleteComment = async () => {
        const confirmationResult = await confirmationModal.confirm(
            "Delete this Comment?",
            "This comment will be permanently deleted. You won't be able to recover it.",
            "Delete",
            "Cancel"
        );

        if(!confirmationResult) return;

        try {
            await deleteCommentMutation.mutateAsync(commentId);

            setTimeout(() => {
                notify.success({
                    title: "Comment removed",
                    description: "Your comment has been removed.",
                });
            }, 200);
        } catch (err: unknown) {
            handleApiErrorNotification(err)
        }
    }

    return (
        <>
            <FloatingMenu
                trigger={
                    <button className="relative cursor-pointer group hover:text-sky-500 duration-100">
                        {/* content */}
                        <div className="w-10 h-10 rounded-full absolute top-0 bottom-0 my-auto -left-1/2 m-auto bg-sky-500/5 z-1 opacity-0 group-hover:opacity-100 duration-100"></div>
                        <EllipsisVertical className="w-5 z-1" />
                    </button>
                }
            >
                <MenuItem handler={handleDeleteComment}>
                    <div className="w-full h-full flex items-center space-x-3 hover:text-rose-500 duration-100">
                        <Trash2 className="w-4" />
                        <span>
                            Delete
                        </span>
                    </div>
                </MenuItem>
            </FloatingMenu>
        </>
    )
}

export default CommentMenu;