const UserSuggestionsSkeletonLoading = () => {
    return (
        <>
            {
                Array.from({ length: 5 }).map((_data, index) => (
                    <article className="w-full flex items-center space-x-2 cursor-wait" key={`user-suggestion-skeleton-${index}`}>
                        <div className="w-12 h-12 bg-neutral-800 animate-pulse rounded-full"></div>
                        <div className="flex-1 space-y-1">
                            <div className="w-32 h-4 rounded bg-neutral-800 animate-pulse"></div>
                            <div className="w-20 h-3 rounded bg-neutral-800 animate-pulse"></div>
                        </div>
                        <div className="w-24 h-10 bg-neutral-800 animate-pulse rounded-lg duration-100"></div>
                    </article>
                ))
            }
        </>
    )
};

export default UserSuggestionsSkeletonLoading;