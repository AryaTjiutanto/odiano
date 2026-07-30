import { EllipsisVertical, Trash2 } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import FloatingMenu from "./FloatingMenu";
import MenuItem from "./MenuItem";
import { deletePost } from "../../services/post.service";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import { useMutation } from "@tanstack/react-query";
import type { PostDTO } from "@odiano/shared";
import { postKeys } from "../../queries/postKeys";
import { removePostFromUserPostCache } from "../../helpers/cache/postCache.helper";
import type { InfiniteQueryPostDTO } from "../../types/post.type";
import { useState } from "react";

type Props = {
    post: PostDTO,
    authorUsername: string | undefined,
    canDeletePost?: boolean
}

const PostMenu = ({ post, authorUsername, canDeletePost = false }: Props) => {
    const setQueryDataHandler = useSetQueryDataHandler();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const user = useAppSelector(state => state.auth.user);

    if (!isAuthenticated || !canDeletePost || !authorUsername) return;

    if (authorUsername !== user?.username) return;

    // delete handler
    const [prevData, setPrevData] = useState<InfiniteQueryPostDTO | null>(null);
    const deletePostMutation = useMutation({
        mutationFn: deletePost,
        onMutate: () => setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(user.username), (oldData) => {
            setPrevData(oldData)
            
            return removePostFromUserPostCache(oldData, post.id)
        }),
        onError: () => setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(user.username), (oldData) => prevData || oldData),
    })

    async function deletePostHandler() {
        try {
            await deletePostMutation.mutateAsync(post.id);
        } catch (err) {
            handleApiErrorNotification(err);
        }
    }

    return (
        <FloatingMenu trigger={
            <button className="relative group hover:text-sky-500">
                <div className="relative cursor-pointer group hover:text-sky-500 duration-100">
                    {/* content */}
                    <div className="w-10 h-10 rounded-full absolute top-0 bottom-0 my-auto -left-1/2 m-auto bg-sky-500/5 z-1 opacity-0 group-hover:opacity-100 duration-100"></div>
                    <EllipsisVertical className="w-5 z-1" />
                </div>
            </button>
        }>
            <MenuItem handler={deletePostHandler}>
                <div className="w-full h-full flex items-center space-x-3 hover:text-rose-500 duration-100">
                    <Trash2 />
                    <span>
                        Delete
                    </span>
                </div>
            </MenuItem>
        </FloatingMenu>
    )
}

export default PostMenu;