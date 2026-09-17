import { Outlet } from "react-router-dom";
import { UserFollowListProvider } from "../providers/UserFollowListProvider";

const ProfileWrapper = () => {
    return (
        <UserFollowListProvider>
            <Outlet />
        </UserFollowListProvider>
    )
};

export default ProfileWrapper;