import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";
import { useNotificationSection } from "../../providers/NotificationSectionProvider";
import GoogleLoginButton from "../auth/GoogleLoginButton";
import UserSuggestions from "../user-suggestions/UserSuggestions";
import NotificationSection from "./NotificationSection";
import RightSidebarFooter from "./RightSidebarFooter";
import { User } from "lucide-react";

const RightSidebar = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const notificationSection = useNotificationSection();

    if (!isInitialized) return;

    if (!isAuthenticated) {
        return (
            <div>
                <h1 className="text-lg font-bold">
                    Welcome to Odiano
                </h1>
                <h2 className="text-sm text-muted-foreground mt-2 text-neutral-300">
                    <b>Sign in</b> or <b>create an account</b> to join the conversation, share moments, and connect with others.
                </h2>
                <div className="flex flex-col mt-5 space-y-3">
                    <GoogleLoginButton />
                    <div className="flex items-center justify-between text-neutral-300">
                        <div className="w-[45%] h-px bg-neutral-500"></div>
                        <span>
                            or
                        </span>
                        <div className="w-[45%] h-px bg-neutral-500"></div>
                    </div>
                    <Link to={"signin"} className="flex w-full h-12 border rounded border-neutral-500 hover:border-white text-neutral-400 hover:text-neutral-100 duration-100">
                        <div className="w-full flex justify-center text-sm items-center space-x-3">
                            <User className="w-4"/>
                            <span className="">
                                Login with Email and Password
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* notification */}
            <div className={`2xl:hidden h-screen bg-black py-5 xl:py-10 absolute top-0 left-0 overflow-hidden z-30 2xl:px-5 ${notificationSection.isOpen ? "w-full opacity-100" : "opacity-0 w-0 touch-none"}`}>
                <NotificationSection />
            </div>

            {/* user suggestions */}
            <UserSuggestions />

            {/* footer */}
            <RightSidebarFooter />
        </>
    )
}

export default RightSidebar;