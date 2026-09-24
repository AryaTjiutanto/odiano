import GoBackIconButton from "../common/GoBackIconButton";

const ProfileSkeletonLoading = () => {
    return (
        <div className="w-full min-h-screen bg-black text-neutral-200 default-input-text-behaviour main-section-padding-top">
            {/* head */}
            <div className="w-full flex items-center space-x-2">
                <GoBackIconButton />
                <div className="space-y-1">
                    <div className="w-32 h-4 bg-neutral-700 animate-pulse rounded"></div>
                    <div className="w-20 h-4 bg-neutral-700 animate-pulse rounded"></div>
                </div>
            </div>

            {/* banner and profile picture */}
            <div className="w-full cover-image-aspect bg-neutral-700 rounded-xl mt-5 relative animate-pulse">
                {/* profile */}
                <div className={`absolute rounded-full w-28 aspect-square left-6 -bottom-[25%] bg-neutral-700`}></div>
            </div>

            {/* action button */}
            <div className="w-full mt-8 flex justify-end space-x-3">
                <div className="w-32 h-11 bg-neutral-700 animate-pulse rounded"></div>
                <div className="w-11 h-11 bg-neutral-700 animate-pulse rounded"></div>
            </div>

            {/* user information */}
            <div className="mt-5">
                <div className="space-y-1">
                    <div className="w-20 h-4 bg-neutral-700 animate-pulse rounded"></div>
                    <div className="w-12 h-4 bg-neutral-700 animate-pulse rounded"></div>
                </div>

                <div className="mt-5 space-y-1">
                    <div className="w-full h-4 bg-neutral-700 animate-pulse rounded"></div>
                    <div className="w-[50%] h-4 bg-neutral-700 animate-pulse rounded"></div>
                </div>
            </div>

            {/* join information */}
            <button className="flex items-center space-x-3 mt-5">
                <div className="flex items-center text-neutral-400 space-x-1">
                    <div className="w-4 h-3 bg-neutral-700 animate-pulse rounded"></div>
                    <div className="w-20 h-3 bg-neutral-700 animate-pulse rounded"></div>
                </div>
            </button>

            {/* follow infomation */}
            <div className="flex items-center space-x-3 mt-5">
                <div className="flex items-center space-x-1 text-sm`">
                    <div className="w-4 h-3 bg-neutral-700 animate-pulse rounded"></div>
                    <div className="w-16 h-3 bg-neutral-700 animate-pulse rounded"></div>
                </div>
                <div className="flex items-center space-x-1 text-sm`">
                    <div className="w-4 h-3 bg-neutral-700 animate-pulse rounded"></div>
                    <div className="w-16 h-3 bg-neutral-700 animate-pulse rounded"></div>
                </div>
            </div>
        </div>
    )
};

export default ProfileSkeletonLoading;