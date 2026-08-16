import { Outlet } from "react-router-dom";
import SocialHeader from "../components/social/SocialHeader";

const ExploreLayout = () => {
    return (
        <>
            {/* head */}
            <title>Explore - Odiano</title>
            <meta
                name="description"
                content="odiano with friends, share posts, and explore communities."
            />

            {/* body */}
            <div>
                <SocialHeader mode="search" />
                <main className="">
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default ExploreLayout;