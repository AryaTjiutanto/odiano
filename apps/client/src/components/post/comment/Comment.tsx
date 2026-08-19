import { formatRelativeShort } from "../../../utils/dateFormater.util";
import { type PostCommentDTO} from "@odiano/shared";
import Profile from "../../profile/Profile";
import { Link, useParams } from "react-router-dom";
import CommentMenu from "../../floating-menu/CommentMenu";

type Props = {
    data: PostCommentDTO,
    postId : string,
    isHightlighted?: boolean,
}

const Comment = ({ data, postId, isHightlighted }: Props) => {
    const { postPublicId } = useParams();

    return (
        <>
            {/* comment */}
            <div className={`w-full flex space-x-3 ${isHightlighted && "bg-sky-500/10 border-l-4 border-sky-400 p-5"}`}>
                <div className="w-12 h-12">
                    <Profile data={data?.author.profileImage} />
                </div>
                <div className="w-full">
                    <div className="flex items-center justify-between w-full">
                        <div className="w-full flex items-center justify-between">
                            <Link to={`/profile/${data.author.username}`} className="flex items-center space-x-2 text-sm">
                                <h1 className="font-bold">{data.author.name || ""}</h1>
                                <h2 className="text-neutral-500">@{data.author.username || ""}</h2>
                            </Link>
                        </div>
                        {
                            (!("isPosted" in data) || data.isPosted) &&
                            <CommentMenu authorId={data.author.id} commentId={data.id} postId={postId} postPublicId={postPublicId}/>
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