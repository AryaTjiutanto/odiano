import type { UserSummaryDTO } from "@odiano/shared";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../profile/Profile";
import FollowingButton from "../social/FollowingButton";
import { useAppSelector } from "../../hooks/useRedux";

type Props = {
    data: UserSummaryDTO,
    usernameLocation?: "bottom" | "right",
    bioLength?: "short" | "long",
    fn? : () => void,
    followListUserId? : string | undefined,
}

const UserSummary = ({ data, usernameLocation, bioLength = "long", fn, followListUserId = undefined }: Props) => {
    const currentUserId = useAppSelector(state => state.auth.user?.id);
    const navigate = useNavigate();

    function navigateToUserProfile() {
        if(fn) fn();
        navigate(`/profile/${data.username}`);
    }

    return (
        <article onClick={navigateToUserProfile} className="w-full flex items-start space-x-3 cursor-pointer">
            <div className="w-full flex items-start space-x-3">
                <div className="w-12 h-12">
                    <Profile data={data.profileImage} />
                </div>
                <div className="flex flex-1 min-w-0 flex-col">
                    <div className={`w-full flex justify-between ${bioLength == "short" && "items-center"}`}>
                        <div className="max-w-[60%]">
                            <div className={`${usernameLocation == "bottom" ? "inline-block" : "flex items-center space-x-2"}`}>
                                <h1 className="text-base font-bold truncate">
                                    {data.name}
                                </h1>
                                <h2 className="text-sm text-neutral-500 truncate">
                                    @{data.username}
                                </h2>
                            </div>
                            {
                                bioLength == "short" &&
                                <p className="w-full text-neutral-300 truncate text-left">
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis dolores atque vitae, praesentium suscipit maxime iure accusamus perspiciatis iste aut rem perferendis reprehenderit nam? Adipisci illum vel delectus quidem aut!
                                </p>
                            }
                        </div>
                        {
                            currentUserId == data.id ?
                                <Link to={`/profile/edit`} className="flex items-center justify-center w-28 h-9 duration-100 bg-white hover:bg-transparent text-neutral-900 hover:text-neutral-100 text-sm border border-white rounded-lg" onClick={(e: any) => e.stopPropagation()}>
                                    Edit Profile
                                </Link>
                                :
                                <div role="button" className={`h-9  duration-100 ${data.isFollowing ? "w-28" : "w-24"}`}>
                                    <FollowingButton isFollowing={data.isFollowing} targetUserId={data.id} targetUsername={data.username} followListUserId={followListUserId} />
                                </div>
                        }
                    </div>
                    {
                        bioLength == "long" &&
                        <p className="text-neutral-300 whitespace-pre-line text-left">
                            {data.bio}
                        </p>
                    }
                </div>
            </div>
        </article>
    )
}

export default UserSummary;