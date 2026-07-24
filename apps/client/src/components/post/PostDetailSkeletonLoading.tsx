const PostDetailSkeletonLoading = () => {
    return (
        <div className="w-full">
            {/* profile */}
            <div className="w-full flex items-center justify-between mt-8">
                <div className="flex items-center space-x-3">
                    <div className="w-12 aspect-square rounded-full bg-neutral-900 animate-pulse"></div>
                    <div>
                        <div className="flex items-center space-x-2 text-base">
                            <div className="w-24 h-3 rounded bg-neutral-900 animate-pulse"></div>
                        </div>
                        <div className="text-sm text-neutral-500">
                            <div className="w-16 h-3 rounded bg-neutral-900 animate-pulse mt-1"></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-20 h-10 rounded-lg bg-neutral-900 animate-pulse"></div>
                    <div className="w-2 h-6 rounded bg-neutral-900 animate-pulse"></div>
                </div>
            </div>
            {/* content */}
            <div className="mt-6">
                <div className="flex flex-col space-y-1">
                    <div className="w-full h-4 rounded bg-neutral-900 animate-pulse"></div>
                    <div className="w-full h-4 rounded bg-neutral-900 animate-pulse"></div>
                    <div className="w-[60%] h-4 rounded bg-neutral-900 animate-pulse"></div>
                </div>
            </div>

            {/* Post information */}
            <div className="flex items-center space-x-3 text-neutral-500 mt-4">
                <div className="w-16 h-4 rounded bg-neutral-900 animate-pulse"></div>
                <div className="w-24 h-4 rounded bg-neutral-900 animate-pulse"></div>
            </div>

            <div className="flex items-center justify-between mt-10">
                <div className="flex items-center space-x-10">
                    <button className="flex items-center space-x-2 cursor-pointer">
                        <div className="w-5 h-5 rounded bg-neutral-900 animate-pulse"></div>
                        <div className="w-3 h-5 rounded bg-neutral-900 animate-pulse"></div>
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded bg-neutral-900 animate-pulse"></div>
                        <div className="w-3 h-5 rounded bg-neutral-900 animate-pulse"></div>
                    </div>
                    <button className="cursor-pointer">
                        <div className="w-5 h-5 rounded bg-neutral-900 animate-pulse"></div>
                    </button>
                </div>

                <button className="cursor-pointer">
                    <div className="w-5 h-5 rounded bg-neutral-900 animate-pulse"></div>
                </button>
            </div>
        </div>
    )
}

export default PostDetailSkeletonLoading;