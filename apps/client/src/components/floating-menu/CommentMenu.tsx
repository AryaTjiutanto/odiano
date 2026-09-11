import { ACTIONS, REPORT_TYPE, SUBJECTS, type PostCommentDTO, type PostDTO } from "@odiano/shared";
import { useAppSelector } from "../../hooks/useRedux";
import FloatingMenu from "./FloatingMenu";
import { EllipsisVertical, Flag, Trash2 } from "lucide-react";
import MenuItem from "./MenuItem";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { deleteComment } from "../../services/post.service";
import { useMutation } from "@tanstack/react-query";
import { postKeys } from "../../queries/postKeys";
import { decreaseCommentCount, increaseCommentCount, removeComment } from "../../helpers/cache/postCache.helper";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import { useConfirmationModal } from "../../providers/ConfirmationModalProvider";
import { notify } from "../../helpers/notification/notify.helper";
import { useAbility } from "@casl/react";
import { type AppAbility } from "../../helpers/ability.helper";
import { subject } from "@casl/ability";
import { useReportForm } from "../../providers/ReportFormProvider";

type Props = {
    postId: string,
    postPublicId: string | undefined,
    authorId: string,
    commentId: string
}

const CommentMenu = ({ postPublicId, postId, commentId, authorId }: Props) => {
    const confirmationModal = useConfirmationModal();
    const setQueryDataHandler = useSetQueryDataHandler();
    const reportForm = useReportForm();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const user = useAppSelector(state => state.auth.user);

    const ability = useAbility<AppAbility>();

    if (!isAuthenticated || !user || !postPublicId) return;
    const canDeleteComment = ability.can(ACTIONS.DELETE, subject(SUBJECTS.COMMENT, {
        author: authorId,
    }));

    // delete comment
    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,

        onMutate: () => {
            let prevData: PostCommentDTO[] | null = null;
            setQueryDataHandler<PostCommentDTO[]>(postKeys.currentUserComments(postId), (oldData) => {
                prevData = oldData;

                return removeComment(oldData, commentId)
            });

            setQueryDataHandler<PostDTO>(postKeys.detail(postPublicId), (oldData) => decreaseCommentCount(oldData));

            return {
                prevData,
            }
        },

        onError: (_error, _variables, context) => {
            setQueryDataHandler<PostCommentDTO[]>(postKeys.currentUserComments(postId), (oldData) => context?.prevData || oldData);

            setQueryDataHandler<PostDTO>(postKeys.detail(postPublicId), (oldData) => increaseCommentCount(oldData));
        }
    })

    const handleDeleteComment = async () => {
        if (!canDeleteComment) return;

        const confirmationResult = await confirmationModal.confirm(
            "Delete this Comment?",
            "This comment will be permanently deleted. You won't be able to recover it.",
            "Delete",
            "Cancel"
        );

        if (!confirmationResult) return;

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

    // report handler
    const reportHandler = async () => {
        reportForm.open(commentId, REPORT_TYPE.COMMENT);
    };

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
                {
                    canDeleteComment &&
                    <MenuItem handler={handleDeleteComment}>
                        <div className="w-full h-full flex items-center space-x-3 hover:text-rose-500 duration-100">
                            <Trash2 className="w-4" />
                            <span>
                                Delete
                            </span>
                        </div>
                    </MenuItem>
                }
                {
                    authorId !== user?.id &&
                    <MenuItem handler={reportHandler}>
                        <div className="w-full h-full flex items-center space-x-3 hover:text-rose-500 duration-100">
                            <Flag className="w-4" />
                            <span>
                                Report
                            </span>
                        </div>
                    </MenuItem>
                }
            </FloatingMenu>
        </>
    )
}

export default CommentMenu;