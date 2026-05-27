import { Search } from "lucide-react";
import StoryList from "../components/social/StoryList";
import Post from "../components/post/Post";
import { useState } from "react";
import type { PostDTO } from "@connect/shared";
import PostSkeletonLoading from "../components/post/PostSkeletonLoading";

const Homepage = () => {
    const [posts, setPosts] = useState<PostDTO[] | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <>
            {/* head */}
            <title>Connect - Share Your Moments</title>
            <meta
                name="description"
                content="Connect with friends, share posts, and explore communities."
            />

            {/* body */}
            <div className="w-full">
                {/* heading */}
                <div className="w-full flex justify-between items-center">
                    {/* search bar */}
                    <div className="w-64 h-11 rounded-lg bg-neutral-900 border border-neutral-700 grid grid-cols-12 pr-2">
                        <div className="col-span-2 h-full grid place-content-center text-neutral-300">
                            <Search className="w-4" />
                        </div>
                        <input className="col-span-10 h-full default-input-text-behaviour" placeholder="Search..." />
                    </div>

                    {/* filter */}
                    <div className="w-fit flex items-center space-x-4">
                        <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-500">
                            Following
                        </button>
                        <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-100">
                            My Feed
                        </button>
                        <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-500">
                            Popular
                        </button>
                    </div>
                </div>
                {/* story */}
                <StoryList />

                {/* posts */}
                <div className="mt-8 space-y-6">
                    <PostSkeletonLoading/>
                    <Post />
                </div>
            </div>
        </>
    )
}

export default Homepage;