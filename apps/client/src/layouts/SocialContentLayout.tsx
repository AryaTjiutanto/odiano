import { Outlet } from "react-router-dom"
import RightSidebar from "../components/social/sidebar/RightSidebar"

const SocialContentLayout = () => {
    return (
        <>
            <div className="grid grid-cols-14 gap-5 md:gap-6 lg:gap-10 xl:gap-14">
                <div className="col-span-8">
                    <Outlet />
                </div>
                <div className="hidden sm:inline-block col-span-5 h-screen sticky top-0 right-0 pt-5 lg:pt-6 xl:pt-8 2xl:pl-20 md:pr-5 lg:pr-10 xl:pr-0">
                    <RightSidebar />
                </div>
            </div>
        </>
    )
}

export default SocialContentLayout