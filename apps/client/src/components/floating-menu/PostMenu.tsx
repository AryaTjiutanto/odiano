import { EllipsisVertical, Flag, Link2, Trash2 } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import FloatingMenu from "./FloatingMenu";
import MenuItem from "./MenuItem";
import { deletePost } from "../../services/post.service";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import { useMutation } from "@tanstack/react-query";
import { ACTIONS, REPORT_TYPE, SUBJECTS, type PostDTO, type UserProfileDTO } from "@odiano/shared";
import { postKeys } from "../../queries/postKeys";
import { removePostFromUserPostCache } from "../../helpers/cache/postCache.helper";
import type { InfiniteQueryPostDTO } from "../../types/post.type";
import { updateUserTotalPosts } from "../../helpers/cache/userCache.helper";
import { userKeys } from "../../queries/userKeys";
import { useConfirmationModal } from "../../providers/ConfirmationModalProvider";
import { notify } from "../../helpers/notification/notify.helper";
import { useAbility } from "@casl/react";
import type { AppAbility } from "../../helpers/ability.helper";
import { subject } from "@casl/ability";
import { useReportForm } from "../../providers/ReportFormProvider";

type Props = {
    post: PostDTO,
    authorId: string | undefined,
}

const PostMenu = ({ post, authorId }: Props) => {
    const reportForm = useReportForm();
    const ability = useAbility<AppAbility>();
    const confirmationModal = useConfirmationModal();
    const setQueryDataHandler = useSetQueryDataHandler();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const user = useAppSelector(state => state.auth.user);

    // define ability
    const canDeletePost = ability.can(ACTIONS.DELETE, subject(SUBJECTS.POST, {
        author: authorId,
    }));

    // delete handler
    const deletePostMutation = useMutation({
        mutationFn: deletePost,
        onMutate: () => {
            if (!post.id || !user) return;

            let prevData: InfiniteQueryPostDTO | null = null;

            setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(user.username), (oldData) => {
                prevData = oldData;

                return removePostFromUserPostCache(oldData, post.id)
            })
            setQueryDataHandler<UserProfileDTO>(userKeys.profile(user.username), (oldData) => updateUserTotalPosts(oldData, 1, "decrease"))

            return {
                prevData,
            }
        },
        onError: (_error, _variables, context) => {
            if (!post.id || !user) return;

            setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(user.username), (oldData) => context?.prevData || oldData)
            setQueryDataHandler<UserProfileDTO>(userKeys.profile(user.username), (oldData) => updateUserTotalPosts(oldData, 1, "increase"))
        },
    })

    async function deletePostHandler() {
        const confirmationResult = await confirmationModal.confirm(
            "Delete this post?",
            "This post will be permanently deleted. You won't be able to recover it.",
            "Delete",
            "Cancel"
        );

        if (!confirmationResult) return;

        try {
            await deletePostMutation.mutateAsync(post.id);

            setTimeout(() => {
                notify.success({
                    title: "Post removed",
                    description: "Your post has been removed.",
                });
            }, 200);
        } catch (err) {
            handleApiErrorNotification(err);
        }
    }

    // copy link handler
    const copyLinkHandler = () => {
        const url = `${window.location.origin}/${post.author?.username}/post/${post.publicId}`;
        navigator.clipboard.writeText(url);

        notify.success({
            title: "Link copied",
            description: url,
        });
    }

    // report handler
    const reportHandler = async () => {
        reportForm.open(post.id, REPORT_TYPE.POST);
    }

    if (!isAuthenticated || !authorId || !user) return;

    return (
        <FloatingMenu trigger={
            <button className="relative group hover:text-sky-500">
                <div className="relative cursor-pointer group hover:text-sky-500 duration-100">
                    {/* content */}
                    <div className="w-10 h-10 rounded-full absolute top-0 bottom-0 my-auto -left-1/2 m-auto bg-sky-500/10 z-1 opacity-0 group-hover:opacity-100 duration-100"></div>
                    <EllipsisVertical className="w-5 z-1" />
                </div>
            </button>
        }>
            {
                canDeletePost ?
                    <MenuItem handler={deletePostHandler}>
                        <div className="w-full h-full flex items-center space-x-3 hover:text-rose-500 duration-100">
                            <Trash2 />
                            <span>
                                Delete
                            </span>
                        </div>
                    </MenuItem>
                    :
                    <MenuItem handler={reportHandler}>
                        <div className="w-full h-full flex items-center space-x-3 hover:text-rose-500 duration-100">
                            <Flag />
                            <span>
                                Report
                            </span>
                        </div>
                    </MenuItem>
            }
            <MenuItem handler={copyLinkHandler}>
                <div className="w-full h-full flex items-center space-x-3 hover:text-sky-500 duration-100">
                    <Link2 />
                    <span>
                        Copy link
                    </span>
                </div>
            </MenuItem>
        </FloatingMenu>
    )
}

export default PostMenu;