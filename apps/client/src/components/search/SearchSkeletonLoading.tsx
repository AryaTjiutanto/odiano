const SearchSkeletonLoading = () => {
    return (
        <div className="w-full flex items-center space-x-3 p-3">
            <div className="w-12 h-12 rounded-full bg-neutral-800 animate-pulse"></div>
            <div className="flex-1 w-full flex flex-col space-y-2">
                <div className="w-[40%] h-2 rounded bg-neutral-800 animate-pulse"></div>
                <div className="w-[60%] h-2 rounded bg-neutral-800 animate-pulse"></div>
            </div>
        </div>
    )
}

export default SearchSkeletonLoading;