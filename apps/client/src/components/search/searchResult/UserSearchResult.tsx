import Profile from "../../social/Profile";
import { type UserSummaryDTO } from "@connect/shared";

type Props = {
    user: UserSummaryDTO,
}

const UserSearchResult = ({ user }: Props) => {
    return (
        <article className="w-full flex items-center px-6 py-3 space-x-2 hover:bg-neutral-800 duration-100">
            <div className="w-12 h-12 rounded-full overflow-hidden">
                <Profile data={user.profileImage} />
            </div>
            <div className="flex-1 w-full flex flex-col">
                <h1 className="font-semibold">
                    {user.username ?? ""}
                </h1>
                <h2 className="text-neutral-400">
                    {user.name ?? ""}
                </h2>
            </div>
        </article>
    )
}

export default UserSearchResult;