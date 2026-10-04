import GoBackIconButton from "../../components/common/GoBackIconButton";
import { useLogout } from "../../hooks/useLogout";

const Settings = () => {
    const { logoutHandler } = useLogout();

    return (
        <div className="w-full h-screen fixed top-0 left-0 z-30 bg-black sm:hidden">
            <header className="w-full flex items-center space-x-3 px-5 sticky top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 pb-6">
                <GoBackIconButton/>
                <h1 className="font-semibold text-xl">
                    Settings
                </h1>
            </header>

            <div className="w-full px-5">
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
    )
}

export default Settings;