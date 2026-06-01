import { Bookmark, EllipsisVertical, Heart, MessageCircle, Send, SmileIcon, User } from "lucide-react";
import GoBackButton from "../../components/common/GoBackButton";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type SuccessResponseData, type PostDTO } from "@connect/shared";
import { api } from "../../libs/api";

const ShowPost = () => {
    const navigate = useNavigate();
    const { postPublicId } = useParams();
    const [postData, setPostData] = useState<PostDTO | null>(null);

    const getPost = async (publicId: string) => {
        try {
            const response = await api.get<SuccessResponseData<PostDTO>>(`/post/${publicId}`);
            console.log(response.data);
            setPostData(response.data.data);
        } catch (err : any) {
        }
    }

    useEffect(() => {
        if (!postPublicId) {
            navigate("/");
            return;
        }

        getPost(postPublicId);
    }, [postPublicId])

    const autoResizeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;

        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }

    return (
        <div className="w-full h-full relative">
            <div>
                <div className="flex items-center space-x-5">
                    <GoBackButton />
                    <h1 className="text-xl font-bold">
                        Post
                    </h1>
                </div>
            </div>
            {/* profile */}
            <div className="w-full flex items-center justify-between mt-8">
                <div className="flex items-center space-x-3">
                    <div className="h-12 aspect-square rounded-full bg-neutral-800 grid place-content-center overflow-hidden">
                        {
                            postData?.author?.profileImage?.url ?
                                <img src={postData.author.profileImage.url} className="w-full h-full" />
                                :
                            <User className="w-4" />
                        }
                    </div>
                    <div>
                        <div className="flex items-center space-x-2 text-base">
                            <h1 className="text-neutral-100 font-semibold">{postData?.author?.name ?? ""}</h1>
                        </div>
                        <div className="text-sm text-neutral-500">
                            <h2 className="text-neutral-500">@{postData?.author?.username ?? ""}</h2>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-5 h-10 rounded-lg border border-neutral-100 hover:bg-neutral-100 hover:text-neutral-700 text-sm cursor-pointer duration-100">
                        Follow
                    </button>
                    <EllipsisVertical className="w-4 duration-100 cursor-pointer" />
                </div>
            </div>
            {/* content */}
            <div className="mt-6">
                {
                    postData?.content ?? ""
                }
            </div>

            {/* Post information */}
            <div className="flex items-center space-x-3 text-neutral-500 mt-4">
                <div>
                    7:56 PM
                </div>
                <div className="w-1 aspect-square rounded-full bg-neutral-700"></div>
                <div>
                    May 29, 2026
                </div>
                {/* <div className="w-1 aspect-square rounded-full bg-neutral-700"></div>
                <div>
                    <b className="text-neutral-300">40</b> Views
                </div> */}
            </div>

            <div className="flex items-center justify-between mt-10">
                <div className="flex items-center space-x-10">
                    <button className="flex items-center space-x-2 cursor-pointer">
                        <Heart />
                        <p>
                            80
                        </p>
                    </button>
                    <div className="flex items-center space-x-2">
                        <MessageCircle />
                        <p>
                            7
                        </p>
                    </div>
                    <button className="cursor-pointer">
                        <Send />
                    </button>
                </div>

                <button className="cursor-pointer">
                    <Bookmark />
                </button>
            </div>


            {/* create comment */}
            <div className="sticky top-0 left-0 w-full bg-neutral-950 border-y border-neutral-800 py-8 mt-10">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 shrink-0" />

                    <div className="flex-1">
                        <textarea
                            onChange={autoResizeTextArea}
                            placeholder="Write a comment..."
                            className="w-full resize-none text-lg bg-transparent text-white placeholder:text-neutral-500 focus:outline-none"
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
                            <button
                                className="px-4 py-2 rounded-full text-neutral-600 text-sm bg-neutral-100 hover:bg-transparent hover:text-neutral-100 border border-neutral-100 duration-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* comments */}
            <div className="w-full space-y-8 mt-10">
                {
                    Array.from({ length: 10 }).map((item) => (
                        <div className="w-full flex space-x-3">
                            <div className="">
                                <div className="w-12 aspect-square rounded-full bg-neutral-800">

                                </div>
                            </div>
                            <div className="w-full">
                                <div className="flex items-center justify-between w-full">
                                    <div className="w-full flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <h1 className="font-bold">Arya Tjiutanto</h1>
                                            <h2 className="text-neutral-500">@aryatjiutanto</h2>
                                        </div>
                                    </div>
                                    <EllipsisVertical className="w-5" />
                                </div>
                                <p className="mt-1">
                                    Lorem ipsum dolor sit amet consectetur.
                                </p>
                                <div className="mt-2 flex items-center space-x-5 text-neutral-500">
                                    <span>
                                        1d
                                    </span>
                                    <button className="text-sm flex items-center space-x-1 cursor-pointer">
                                        <Heart className="w-4" />
                                        <span>
                                            5
                                        </span>
                                    </button>
                                    <button className="cursor-pointer">
                                        Replay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ShowPost;