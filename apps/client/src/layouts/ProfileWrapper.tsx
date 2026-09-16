import { Outlet } from "react-router-dom";
import { UserFollowersModalProvider } from "../providers/UserFollowersModalProvider";
import { UserFollowingModalProvider } from "../providers/UserFollowingModalProvider";

const ProfileWrapper = () => {
    return (
        <UserFollowingModalProvider>
            <UserFollowersModalProvider>
                <Outlet />
            </UserFollowersModalProvider>
        </UserFollowingModalProvider>
    )
};

export default ProfileWrapper;