const NotificationSkeletonLoading = () => {
    return (
        <div className="w-full flex items-center space-x-3">
            <div className="h-12 aspect-square rounded-full bg-neutral-900 animate-pulse">
            </div>

            <div className="flex-1 w-full flex space-x-2 space-y-2 flex-wrap">
                <div className="w-[30%] h-3 rounded bg-neutral-900 animate-pulse"></div>
                <div className="w-[50%] h-3 rounded bg-neutral-900 animate-pulse"></div>
                <div className="w-[20%] h-3 rounded bg-neutral-900 animate-pulse"></div>
                <div className="w-[5%] h-3 rounded bg-neutral-900 animate-pulse"></div>
            </div>
        </div>
    )
}

export default NotificationSkeletonLoading;