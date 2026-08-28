import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useRedux";
import GoogleLoginButton from "../../auth/GoogleLoginButton";
import SmallUserSuggestions from "../../user-suggestions/Small/SmallUserSuggestions";
import RightSidebarFooter from "./RightSidebarFooter";
import { User } from "lucide-react";

const RightSidebar = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);

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
            {/* user suggestions */}
            <SmallUserSuggestions />

            {/* footer */}
            <RightSidebarFooter />
        </>
    )
}

export default RightSidebar;