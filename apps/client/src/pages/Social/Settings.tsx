import { Lock, Smartphone } from "lucide-react";
import GoBackIconButton from "../../components/common/GoBackIconButton";
import SEO from "../../components/seo/SEO";
import { useLogout } from "../../hooks/useLogout";

const Settings = () => {
    const { logoutHandler } = useLogout();

    return (
        <>
            <SEO title="Settings" />
            <div className="w-full h-screen fixed sm:relative top-0 left-0 z-30 sm:z-auto bg-black">
                <header className="w-full flex items-center space-x-3 px-5 sm:px-0 sticky top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 pb-6">
                    <div className="">
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
                    <div className="w-full mt-3">
                        <button className="w-full h-10 flex items-center space-x-3">
                            <Smartphone />
                            <span>
                                Devices and Sessions
                            </span>
                        </button>
                        <button className="w-full h-10 flex items-center space-x-3">
                            <Lock />
                            <span>
                                Two-Factor Authentication
                            </span>
                        </button>
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
            </div>
        </>
    )
}

export default Settings;