import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { logout } from "../../../features/auth/auth.thunk";
import Profile from "../../profile/Profile";
import { EllipsisVertical, FilePenLine, MailWarning } from "lucide-react";
import { Link } from "react-router-dom";
import { autoUpdate, FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react";

const UserMenu = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const userData = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();


    const profileLink = !isAuthenticated
        ? "/signin"
        : !userData?.isEmailVerified
            ? "/email/verify"
            : "/onboarding";

    // popover handler
    const [isOpen, setIsOpen] = useState<boolean>();
    const { refs, floatingStyles, context } = useFloating({
        strategy: "fixed",
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(20),
            shift(),
        ],
        placement: "top-start",
        open: isOpen,
        onOpenChange: setIsOpen,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

    // logout
    const logoutHandler = () => {
        dispatch(logout());
    }

    if (!isInitialized) {
        return (
            <div className="w-full flex items-center justify-between space-x-10 cursor-wait">
                <div className="w-full flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 animate-pulse"></div>

                    <div className="w-full flex-1 space-y-2">
                        <div className="w-[80%] h-4 rounded bg-neutral-800 animate-pulse"></div>
                        <div className="w-[50%] h-3 rounded bg-neutral-800 animate-pulse"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) return;

    if (!userData || !userData.isOnboarded || !userData.isEmailVerified) {
        return (
            <Link to={profileLink}>
                <button className="w-full flex items-center justify-between space-x-10 cursor-pointer">
                    <div className="flex items-center xl:space-x-3">
                        <div className="w-12 h-12 hidden xl:inline-block">
                            <Profile data={null} />
                        </div>

                        <div className="w-10 h-10 text-neutral-900 xl:text-neutral-100 bg-neutral-50 xl:bg-transparent rounded-full xl:rounded-none xl:h-fit xl:w-fit xl:text-left flex items-center justify-center xl:justify-start">
                            {!userData?.isEmailVerified ? (
                                <>
                                    <MailWarning className="xl:hidden w-4" />

                                    <h1 className="text-base font-semibold hidden xl:inline-block">
                                        Verify your Email
                                    </h1>
                                </>
                            ) : (
                                <>
                                    <FilePenLine className="xl:hidden w-4" />
                                    <h1 className="text-base font-semibold hidden xl:inline-block">
                                        Complete your data
                                    </h1>
                                </>
                            )}
                        </div>
                    </div>
                </button>
            </Link>
        )
    }

    return (
        <>
            <div className="w-fit xl:w-full">
                {/* popover */}
                <FloatingPortal>
                    {isOpen &&
                        <div className={`w-72 xl:w-60 2xl:w-80 text-white duration-100 font-bold transition-none transition-opacity z-25 ${!isOpen ? "opacity-0 overflow-hidden" : "opacity-100"}`} {...getFloatingProps()} style={floatingStyles} ref={refs.setFloating}>
                            <div className="w-full relative rounded-xl z-2 overflow-hidden bg-neutral-900">
                                <button className="w-full px-5 py-4 text-left bg-neutral-900 hover:text-neutral-500 cursor-pointer duration-100" onClick={logoutHandler}>
                                    Log out @{userData.username}
                                </button>
                            </div>
                            <div className="w-4 h-4 bg-neutral-900 left-2 xl:right-0 xl:left-0 mx-auto -bottom-1.5 rotate-45 absolute z-1"></div>
                        </div>
                    }
                </FloatingPortal>

                {/* button */}
                <button type="button" className="w-fit xl:w-full flex items-center justify-between xl:space-x-2 2xl:space-x-10 cursor-pointer z-1" {...getReferenceProps()} ref={refs.setReference}>
                    <div className="flex flex-1 items-center xl:space-x-3">
                        <div className="w-12 h-12">
                            <Profile data={userData.profileImage} />
                        </div>
                        <div className="text-left hidden xl:inline-block">
                            <h1 className="text-base font-semibold truncate">{userData.name}</h1>
                            <p className="text-sm text-neutral-700 truncate">
                                @{userData.username}
                            </p>
                        </div>
                    </div>
                    <div className="hidden xl:inline-block">
                        <EllipsisVertical />
                    </div>
                </button>
            </div>
        </>
    )
}

export default UserMenu;