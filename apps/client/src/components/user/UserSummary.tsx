import type { UserSummaryDTO } from "@odiano/shared";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../profile/Profile";
import FollowingButton from "../social/FollowingButton";
import { useAppSelector } from "../../hooks/useRedux";

type Props = {
    data: UserSummaryDTO,
}

const UserSummary = ({ data }: Props) => {
    const currentUserId = useAppSelector(state => state.auth.user?.id);
    const navigate = useNavigate();

    return (
        <article onClick={() => navigate(`/profile/${data.username}`)} className="w-full flex items-start space-x-3 cursor-pointer">
            <div className="w-full flex items-start space-x-3">
                <div className="w-12 h-12">
                    <Profile data={data.profileImage} />
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="w-full flex justify-between">
                        <div>
                            <h1 className="text-base font-bold truncate">
                                {data.name}
                            </h1>
                            <h2 className="text-sm text-neutral-500 truncate">
                                @{data.username}
                            </h2>
                        </div>
                        {
                            currentUserId == data.id ?
                                <Link to={`/profile/edit`} className="flex items-center justify-center w-28 h-9 duration-100 bg-white hover:bg-transparent text-neutral-900 hover:text-neutral-100 text-sm border border-white rounded-lg" onClick={(e: any) => e.stopPropagation()}>
                                    Edit Profile
                                </Link>
                            :
                                <div role="button" className={`h-9  duration-100 ${data.isFollowing ? "w-28" : "w-24"}`}>
                                    <FollowingButton isFollowing={data.isFollowing} userId={data.id} username={data.username} />
                                </div>
                        }
                    </div>
                    <p className="text-neutral-300 whitespace-pre-line text-left">
                        {data.bio}
                    </p>
                </div>
            </div>
        </article>
    )
}

export default UserSummary;