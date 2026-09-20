type Props = {
    usernameLocation?: "bottom" | "right",
    bioLength?: "short" | "long",
}

const UserSummarySkeletonLoading = ({
    usernameLocation = "bottom",
    bioLength = "long",
}: Props) => {
    return (
        <article className="w-full flex items-start space-x-3 cursor-wait">
            <div className="w-full flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full animate-pulse bg-neutral-800"></div>
                <div className="flex flex-1 flex-col">
                    <div className={`w-full ${bioLength == "short" && "items-center"} flex justify-between`}>
                        <div>
                            <div className={`flex items-center space-x-2`}>
                                <div className="w-26 h-4 bg-neutral-700 animate-pulse rounded"></div>
                                {usernameLocation == "right" &&
                                    <div className="w-14 h-4 bg-neutral-700 animate-pulse rounded-sm"></div>
                                }
                            </div>
                            <div className="w-[50%] h-3 mt-1 bg-neutral-700 animate-pulse rounded-sm"></div>
                        </div>
                        <div className="w-24 h-9 bg-neutral-700 animate-pulse rounded-lg"></div>
                    </div>
                    {
                        bioLength == "long" &&
                        <div className="w-full space-y-1 mt-2">
                            <div className="w-full h-3 bg-neutral-700 animate-pulse rounded"></div>
                            <div className="w-[50%] h-3 bg-neutral-700 animate-pulse rounded"></div>
                        </div>
                    }
                </div>
            </div>
        </article>
    )
}

export default UserSummarySkeletonLoading;