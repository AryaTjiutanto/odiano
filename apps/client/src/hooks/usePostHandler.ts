import { ERROR_RESPONSE_CODE, type PostDTO } from "@odiano/shared";
import useSetQueryDataHandler from "./useSetQueryDataHandler";
import type { InfiniteQueryPostDTO } from "../types/post.type";
import { createLike, deleteLike } from "../services/post.service";
import { useMutation } from "@tanstack/react-query";
import { applyLikeToInfinitePostCache, applyLikeToPostCache, removeLikeFromInfinitePostCache, removeLikeFromPostCache } from "../helpers/cache/postCache.helper";
import { postKeys } from "../queries/postKeys";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "./useRedux";
import { handleApiErrorNotification } from "../helpers/errors/apiError.helper";

type LikeProps = {
    postId: string,
    authorUsername: string | null | undefined,
}

const usePostHandler = (postPublicId: string) => {
    const setQueryDataHandler = useSetQueryDataHandler();
    const currentUserData = useAppSelector(state => state.auth.user);
    const navigate = useNavigate();

    function likeMutationHandler(postPublicId: string, postId: string, authorUsername: string | null | undefined) {
        setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.all, (old) => applyLikeToInfinitePostCache(old, postId))

        // set post data
        setQueryDataHandler<PostDTO>(postKeys.detail(postPublicId), (old) => applyLikeToPostCache(old));

        // set user posts
        if (!authorUsername) return;
        setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(authorUsername), (old) => applyLikeToInfinitePostCache(old, postId))
    }

    function unlikeMutationHandler(postPublicId: string, postId: string, authorUsername: string | null | undefined) {
        setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.all, (old) => removeLikeFromInfinitePostCache(old, postId))

        // set post data
        setQueryDataHandler<PostDTO>(postKeys.detail(postPublicId), (old) => removeLikeFromPostCache(old));

        // set user posts
        if (!authorUsername) return;
        setQueryDataHandler<InfiniteQueryPostDTO>(postKeys.userPosts(authorUsername), (old) => removeLikeFromInfinitePostCache(old, postId));
    }

    // like mutation
    const likeMutation = useMutation<void, Error, LikeProps>({
        mutationFn: ({ postId }) => createLike(postId),

        onMutate: ({ authorUsername, postId }) => likeMutationHandler(postPublicId!, postId, authorUsername),
        onError: (_err, { authorUsername, postId }) => unlikeMutationHandler(postPublicId!, postId, authorUsername),
    })

    // delete like mutation
    const unlikeMutation = useMutation<void, Error, LikeProps>({
        mutationFn: ({ postId }) => deleteLike(postId),

        onMutate: ({ authorUsername, postId }) => unlikeMutationHandler(postPublicId!, postId, authorUsername),
        onError: (_err, { authorUsername, postId }) => likeMutationHandler(postPublicId!, postId, authorUsername),
    })

    const handleLike = async (isLiked: boolean, postId: string, authorUsername: string | null | undefined) => {
        if (!currentUserData) {
            return navigate("/signin")
        }

        if (!currentUserData.isEmailVerified || !currentUserData.isOnboarded) {
            return navigate("/onboarding");
        }

        try {
            if (isLiked) {
                await unlikeMutation.mutateAsync({ postId, authorUsername });
            } else {
                await likeMutation.mutateAsync({ postId, authorUsername });
            }
        } catch (err: unknown) {
            handleApiErrorNotification(err, {
                notifications: {
                    [ERROR_RESPONSE_CODE.conflict]: {
                        title: "Action not allowed",
                    }
                }
            });
        }
    }

    return {
        handleLike
    }
}

export default usePostHandler;