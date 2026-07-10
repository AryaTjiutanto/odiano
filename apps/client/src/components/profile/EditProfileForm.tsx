import GoBackIconButton from "../common/GoBackIconButton";
import ProfileComponent from "../social/Profile";

const EditProfileForm = () => {
    return (
        <div className="w-full min-h-screen bg-neutral-950">
            {/* header */}
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <GoBackIconButton />
                    <h1 className="text-2xl font-bold">
                        Edit Profile
                    </h1>
                </div>
                <button className="w-20 h-10 rounded-lg bg-white border border-white text-neutral-800 hover:bg-transparent hover:text-neutral-100 cursor-pointer duration-100">
                    Save
                </button>
            </div>

            {/* banner */}
            <div className="w-full banner-aspect bg-neutral-200 rounded-xl mt-5 relative">
                {/* profile */}
                <div className={`absolute w-28 aspect-square left-6 -bottom-[25%] flex items-center justify-center`}>
                    <ProfileComponent data={null} />
                </div>
            </div>
        </div>
    );
};

export default EditProfileForm;