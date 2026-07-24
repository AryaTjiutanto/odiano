const UserMenu = () => {
    return (
        <>
            {
                isAuthenticated && userData?.isOnboarded ?
                    <div className="relative w-fit xl:w-full">
                        {/* popover */}
                        <div className={`w-48 xl:w-[120%] 2xl:w-full absolute -top-20 duration-100 font-bold ${isProfilePopoverHidden ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-fit"}`}>
                            <div className="w-full relative rounded-xl z-2 overflow-hidden bg-neutral-950">
                                <button className="w-full px-5 py-4 text-left bg-neutral-950 hover:text-neutral-500 cursor-pointer duration-100" onClick={logoutHandler}>
                                    Log out @{userData.username}
                                </button>
                            </div>
                            <div className="w-4 h-4 bg-neutral-950 right-0 left-0 mx-auto -bottom-1.5 rotate-45 absolute z-1"></div>
                        </div>

                        {/* button */}
                        <button className="w-fit xl:w-full flex items-center justify-between xl:space-x-2 2xl:space-x-10 cursor-pointer z-1" onClick={() => setIsProfilePopoverHidden(!isProfilePopoverHidden)}>
                            <div className="flex flex-1 items-center xl:space-x-3">
                                <div className="w-12 h-12">
                                    <Profile data={userData.profileImage} />
                                </div>
                                <div className="text-left hidden xl:inline-block">
                                    <h1 className="text-base font-semibold">{userData.name}</h1>
                                    <p className="text-sm text-neutral-700">
                                        @{userData.username}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden xl:inline-block">
                                <EllipsisVertical />
                            </div>
                        </button>
                    </div>
                    :
                    <Link to={profileLink}>
                        <button className="w-full flex items-center justify-between space-x-10 cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12">
                                    <Profile data={null} />
                                </div>

                                <div className="text-left">
                                    {!isAuthenticated ? (
                                        <h1 className="text-base font-semibold">
                                            Create an account or sign in
                                        </h1>
                                    ) : !userData?.isEmailVerified ? (
                                        <h1 className="text-base font-semibold">
                                            Verify your Email
                                        </h1>
                                    ) : (
                                        <h1 className="text-base font-semibold">
                                            Complete your data
                                        </h1>
                                    )}
                                </div>
                            </div>
                        </button>
                    </Link>
            }
        </>
    )
}

export default UserMenu;