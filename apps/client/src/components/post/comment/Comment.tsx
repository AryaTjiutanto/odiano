import { EllipsisVertical } from "lucide-react";
import { formatRelativeShort } from "../../../utils/dateFormater.util";
import { type PostCommentDTO, type PostDTO } from "@connect/shared";
import Profile from "../../profile/Profile";
import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../../../services/post.service";
import useSetQueryDataHandler from "../../../hooks/useSetQueryDataHandler";
import { postKeys } from "../../../queries/postKeys";
import { useParams } from "react-router-dom";
import { decreaseCommentCount, increaseCommentCount, removeComment } from "../../../helpers/cache/postCache.helper";
import {flip, offset, shift, useClick, useDismiss, useFloating, useInteractions} from "@floating-ui/react";
import { useState } from "react";
import CommentMenu from "./CommentMenu";
import { useAppSelector } from "../../../hooks/useRedux";
import { handleApiErrorNotification } from "../../../helpers/errors/apiError.helper";

type Props = {
    data: PostCommentDTO,
    postId : string,
}

const Comment = ({ data, postId }: Props) => {
    const currentUserId = useAppSelector((state) => state.auth.user?.id)
    const setQueryDataHandler = useSetQueryDataHandler();

    const { postPublicId } = useParams();

    // floating ui
    const role = data.author.id == currentUserId ? 'owner' : 'viewer';
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const {refs, floatingStyles, context} = useFloating({
        placement : "bottom-end",
        middleware : [
            shift(),
            flip(),
            offset(8),
        ],
        open : isMenuOpen,
        onOpenChange : setIsMenuOpen,
    })

    const dismiss = useDismiss(context)
    const click = useClick(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([click, dismiss]);

    // query Key
    const currentUserCommentQueryKey = postKeys.currentUserComments(postId);
    const postQueryKey = postPublicId && postKeys.detail(postPublicId);

    // mutation
    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,

        onMutate: () => {
            if(!postQueryKey) return;

            setQueryDataHandler<PostCommentDTO[]>(currentUserCommentQueryKey, (oldData) => removeComment(oldData, data.id));

            setQueryDataHandler<PostDTO>(postQueryKey, (oldData) => decreaseCommentCount(oldData));
        },

        onError: () => {
            if(!postQueryKey) return;

            setQueryDataHandler<PostCommentDTO[]>(currentUserCommentQueryKey, (oldData) => removeComment(oldData, data.id));
            setQueryDataHandler<PostDTO>(postQueryKey, (oldData) => increaseCommentCount(oldData));
        }
    })

    const handleDeleteComment = async () => {
        try {
            await deleteCommentMutation.mutateAsync(data.id)
        } catch (err: unknown) {
            handleApiErrorNotification(err)
        }
    }

    return (
        <>
            {/* menu */}
            <CommentMenu isOpen={isMenuOpen} ref={refs.setFloating} floatingProps={getFloatingProps()} style={floatingStyles} handlers={{ delete : handleDeleteComment }} role={role}/>

            {/* comment */}
            <div className="w-full flex space-x-3">
                <div className="w-12 h-12">
                    <Profile data={data?.author.profileImage} />
                </div>
                <div className="w-full">
                    <div className="flex items-center justify-between w-full">
                        <div className="w-full flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm">
                                <h1 className="font-bold">{data.author.name || ""}</h1>
                                <h2 className="text-neutral-500">@{data.author.username || ""}</h2>
                            </div>
                        </div>
                        
                        {
                            (!("isPosted" in data) || data.isPosted) &&
                            <button className="relative cursor-pointer group hover:text-sky-500 duration-100" ref={refs.setReference} {...getReferenceProps()}>
                                {/* content */}
                                <div className="w-10 h-10 rounded-full absolute top-0 bottom-0 my-auto -left-1/2 m-auto bg-sky-500/5 z-1 opacity-0 group-hover:opacity-100 duration-100"></div>
                                <EllipsisVertical className="w-5 z-2" />
                            </button>
                        }
                    </div>
                    <p className="mt-1 whitespace-pre-wrap">
                        {data.content || ""}
                    </p>
                    {
                        ("isPosted" in data && data.isPosted == false) ?
                            <div className="text-xs text-neutral-500 mt-2">
                                Loading...
                            </div>
                            :
                            <div className="mt-2 flex items-center space-x-5 text-neutral-500">
                                <span>
                                    {formatRelativeShort(data.createdAt)}
                                </span>

                                {/* comming soon */}
                                {/* <button className="text-sm flex items-center space-x-1 cursor-pointer">
                                    <Heart className="w-4" />
                                    <span>
                                        5
                                    </span>
                                </button>
                                <button className="cursor-pointer">
                                    Replay
                                </button> */}
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Comment;