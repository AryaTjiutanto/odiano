import GoBackIconButton from "../common/GoBackIconButton";

const EditProfileSkeletonLoading = () => {
    return (
        <div className="w-full min-h-screen">
            {/* header */}
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <GoBackIconButton />
                    <h1 className="text-2xl font-bold">
                        Edit Profile
                    </h1>
                </div>
                <div className="w-18 h-9.5 rounded-full bg-neutral-900 animate-pulse"></div>
            </div>

            {/* cover image */}
            <div className="w-full cover-image-aspect bg-neutral-900 rounded-xl mt-5 relative animate-pulse">
                {/* profile */}
                <div className={`absolute w-28 aspect-square left-6 -bottom-[25%] flex items-center justify-center bg-neutral-900 rounded-full`}></div>
            </div>

            {/* input */}
            <div className="w-full mt-18 h-12 bg-neutral-900 animate-pulse rounded"></div>
            <div className="w-full mt-4 h-28 bg-neutral-900 animate-pulse rounded"></div>
        </div>
    )
}

export default EditProfileSkeletonLoading;