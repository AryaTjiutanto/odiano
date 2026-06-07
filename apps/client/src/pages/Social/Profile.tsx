import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../../features/auth/auth.thunk";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/useRedux";
import GoBackIconButton from "../../components/common/GoBackIconButton";
import { CalendarDays, EllipsisVertical, User } from "lucide-react";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {username} = useParams();

    const user = useAppSelector((state) => state.auth.user);

    const logoutHandler = () => {
        dispatch(logout());
        navigate("/signin");
    }

    return (
        <div className="w-full min-h-screen bg-neutral-950 text-neutral-200">
            {/* head */}
            <div className="w-full flex items-center space-x-2">
                <GoBackIconButton />
                <div>
                    <h1 className="font-bold text-white">
                        {user && user.name || ""}
                    </h1>
                    <h2 className="text-xs text-neutral-400">
                        0 Post
                    </h2>
                </div>
            </div>

            {/* banner and profile picture */}
            <div className="w-full banner-aspect bg-neutral-200 rounded-xl mt-5 relative">
                {/* profile */}
                <div className={`absolute rounded-full w-28 aspect-square left-6 -bottom-[25%] bg-neutral-300 flex items-center justify-center`}>
                    <div className="w-[97%] aspect-square rounded-full bg-neutral-800 grid place-content-center text-neutral-600">
                        {
                            user?.profileImage ?
                                <img src={user.profileImage.url} className="w-full h-full" />
                                :
                                <User className="size-10 text-neutral-300" />
                        }
                    </div>
                </div>
            </div>

            {/* action button */}
            <div className="w-full mt-8 flex justify-end space-x-3">
                <button className="w-32 h-11 bg-white border border-white rounded-lg text-neutral-900 hover:text-neutral-100 hover:bg-transparent cursor-pointer duration-100">
                    Follow
                </button>
                <button className="w-11 h-11 grid place-content-center duration-100 border border-white rounded-lg hover:bg-white hover:text-neutral-900 cursor-pointer">
                    <EllipsisVertical />
                </button>
            </div>

            {/* user information */}
            <div className="mt-5">
                <div>
                    <h1 className="text-2xl font-bold">
                        {user && user.name || ""}
                    </h1>
                    <h2 className="text-sm text-neutral-500 mt-1">
                        @{user && user.username || ""}
                    </h2>
                </div>

                {/* {(user && user.bio) &&
                    <p className="mt-5 text-neutral-400">
                        {user.bio || ""}
                    </p>
                } */}
            </div>

            {/* join information */}
            <button className="flex items-center space-x-3 mt-5">
                <div className="flex items-center text-neutral-400 space-x-2">
                    <CalendarDays className="w-4"/>
                    <span className="text-sm">
                        Join September 2026
                    </span>
                </div>
            </button>

            {/* follow infomation */}
            <div className="flex items-center space-x-3 mt-5">
                <div className="flex items-center space-x-2 text-sm`">
                    <h1 className="font-bold">
                        0
                    </h1>
                    <span className="text-neutral-400">
                        Followers
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm`">
                    <h1 className="font-bold">
                        0
                    </h1>
                    <span className="text-neutral-400">
                        Following
                    </span>
                </div>
            </div>

            {/* posts */}
            <div className="w-full border-b border-neutral-800 mt-7">
                <button className="w-24 pb-3 relative font-semibold">
                    Post
                    <div className="w-full h-[3px] rounded bg-white absolute -bottom-0">
                    </div>
                </button>
            </div>
        </div>
    )
}

export default Profile;