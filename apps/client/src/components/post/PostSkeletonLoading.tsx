const PostSkeletonLoading = () => {
    return (
        <article className="w-full p-7 rounded-lg bg-neutral-900">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-10 aspect-square rounded-full bg-neutral-700 animate-pulse"></div>
                    <div>
                        <div className="flex items-center space-x-2 text-xs">
                            <div className="w-12 h-3 bg-neutral-700 rounded animate-pulse">
                            </div>
                            <div className="w-8 h-3 bg-neutral-700 rounded animate-pulse">
                            </div>
                        </div>
                        <div className="w-5 h-3 bg-neutral-700 rounded animate-pulse mt-2">
                        </div>
                    </div>
                </div>
                <div className="w-4 h-3 bg-neutral-700 rounded animate-pulse">
                </div>
            </div>
            <div className="text-sm mt-8">
                <div className="w-full h-3 bg-neutral-700 rounded animate-pulse">
                </div>
                <div className="w-[60%] h-3 bg-neutral-700 rounded animate-pulse mt-2">
                </div>
                <div className="w-[60%] h-3 bg-neutral-700 rounded animate-pulse mt-10">
                </div>
            </div>
            <div className="mt-8 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <div className="w-4 h-3 bg-neutral-700 rounded animate-pulse">
                        </div>
                        <div className="w-2 h-3 bg-neutral-700 rounded animate-pulse">
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-4 h-3 bg-neutral-700 rounded animate-pulse">
                        </div>
                        <div className="w-2 h-3 bg-neutral-700 rounded animate-pulse">
                        </div>
                    </div>
                </div>
                <div className="w-4 h-3 bg-neutral-700 rounded animate-pulse">
                </div>
            </div>
        </article>
    );
}

export default PostSkeletonLoading;