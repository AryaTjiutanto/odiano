const CommentSkeletonLoading = () => {
    return (
        <div className="w-full flex space-x-3">
            <div className="">
                <div className="w-12 aspect-square rounded-full bg-neutral-900 animate-pulse"></div>
            </div>
            <div className="w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                            <div className="w-16 h-4 bg-neutral-700 rounded animate-pulse"></div>
                            <div className="w-12 h-4 bg-neutral-700 rounded animate-pulse"></div>
                        </div>
                    </div>

                    <div className="w-5 h-4 bg-neutral-700 rounded animate-pulse"></div>
                </div>
                <div className="mt-2 space-y-1">
                    <div className="w-full h-4 bg-neutral-700 rounded animate-pulse"></div>
                    <div className="w-[70%] h-4 bg-neutral-700 rounded animate-pulse"></div>
                </div>
                <div className="mt-2 flex items-center space-x-5 text-neutral-500">
                    <div className="w-5 h-4 bg-neutral-700 rounded animate-pulse"></div>
                    <button className="text-sm flex items-center space-x-1 cursor-pointer">
                        <div className="w-4 h-4 bg-neutral-700 rounded animate-pulse"></div>
                        <div className="w-5 h-4 bg-neutral-700 rounded animate-pulse"></div>
                    </button>
                    <div className="w-10 h-4 bg-neutral-700 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export default CommentSkeletonLoading;