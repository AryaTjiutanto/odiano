import { Lock, Smartphone } from "lucide-react";
import { useLogout } from "../../hooks/useLogout";
import GoBackIconButton from "../common/GoBackIconButton";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const { pathname } = useLocation();
    const { logoutHandler } = useLogout();

    return (
        <aside className="w-full h-screen fixed sm:relative top-0 left-0 z-30 sm:z-auto bg-black sm:col-span-5">
            <header className="w-full flex items-center space-x-3 px-5 sm:px-0 sticky top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 pb-6">
                <div className="sm:hidden">
                    <GoBackIconButton />
                </div>
                <h1 className="font-semibold text-xl">
                    Settings
                </h1>
            </header>

            {/* security and login */}
            <div className="w-full">
                <span className="text-sm text-neutral-400 font-semibold">
                    Security and Login
                </span>
                <div className="w-full mt-3 space-y-1">
                    <Link to={"/settings/devices-and-sessions"} className={`w-full px-3 rounded-lg h-12 flex items-center space-x-3 cursor-pointer duration-100 ${pathname == "/settings/devices-and-sessions" ? "bg-neutral-800" : "bg-transparent  hover:bg-neutral-800"}`}>
                        <Smartphone />
                        <span className="text-sm">
                            Devices and Sessions
                        </span>
                    </Link>
                    <Link to={"/settings/two-factor-authentication"} className={`w-full px-3 rounded-lg h-12 flex items-center space-x-3 cursor-pointer duration-100 ${pathname == "/settings/two-factor-authentication" ? "bg-neutral-800" : "bg-transparent  hover:bg-neutral-800"}`}>
                        <Lock />
                        <span className="text-sm">
                            Two-Factor Authentication
                        </span>
                    </Link>
                </div>
            </div>

            <div className="w-full px-5 sm:px-0 sm:hidden">
                <h2 className="text-neutral-400 font-semibold text-sm">
                    Login
                </h2>
                <p className="mt-2 text-neutral-200">
                    Signed in to your account. Click below to end your current session safely.
                </p>
                <button className="w-full h-11 mt-5 bg-neutral-950 border-[0.5px] border-neutral-700 rounded-lg text-neutral-300 text-xs hover:bg-transparent cursor-pointer duration-100" onClick={logoutHandler}>
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;