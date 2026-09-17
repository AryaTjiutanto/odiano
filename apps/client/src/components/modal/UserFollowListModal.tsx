import { Search, X } from "lucide-react";
import { useUserFollowList } from "../../providers/UserFollowListProvider";
import { USER_FOLLOW_LIST_TYPE } from "../../types/user.type";
import { useAppSelector } from "../../hooks/useRedux";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const UserFollowListModal = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const { closeModal, selectedFollowListType, followCount } = useUserFollowList();

    // query
    const userFollowingQuery = useQuery({
        
        enabled : !!(selectedFollowListType && selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWING),
    })


    
    // display
    if (!isAuthenticated) {
        return (
            <section className="w-full h-full fixed top-0 left-0 grid place-content-center z-25">
                <div className="w-full h-full bg-black/50 absolute z-25 cursor-pointer" onClick={closeModal}></div>

                <div className="w-[500px] h-72 z-26 rounded-lg grid place-content-center bg-neutral-900 px-10 text-center relative">
                    <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-3 right-3" onClick={closeModal}>
                        <X className="w-5" />
                    </button>

                    <div>
                        <Link to={"/signin"} className="text-sky-500 underline hover:text-sky-400 duration-100">
                            Signin
                        </Link> {""}
                        or {""}
                        <Link to={"/signup"} className="text-sky-500 underline hover:text-sky-400 duration-100">
                            Create an account
                        </Link> {""}
                        to view this content
                    </div>
                </div>
            </section>
        )
    }

    if (followCount <= 0) {
        return (
            <section className="w-full h-full fixed top-0 left-0 grid place-content-center z-25">
                <div className="w-full h-full bg-black/50 absolute z-25 cursor-pointer" onClick={closeModal}></div>

                <div className="w-[500px] h-72 z-26 rounded-lg grid place-content-center bg-neutral-900 px-10 text-center relative">
                    <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-3 right-3" onClick={closeModal}>
                        <X className="w-5" />
                    </button>

                    <div className="py-12 text-center">
                        <h2 className="text-lg font-bold text-white">
                            {selectedFollowListType === USER_FOLLOW_LIST_TYPE.FOLLOWERS
                                ? "No followers yet"
                                : "Not following anyone yet"}
                        </h2>

                        <p className="mt-1 text-sm text-neutral-400">
                            This list is currently empty.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full h-full fixed top-0 left-0 grid place-content-center z-25">
            <div className="w-full h-full bg-black/50 absolute z-25 cursor-pointer" onClick={closeModal}></div>

            <div className="w-[500px] z-26 rounded-lg bg-neutral-900">
                {/* head */}
                <div className="w-full h-14 flex items-center justify-center border-neutral-700 border-b text-center relative">
                    <h1 className="text-lg font-semibold">
                        {
                            selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWERS &&
                            "Followers"
                        }
                        {
                            selectedFollowListType == USER_FOLLOW_LIST_TYPE.FOLLOWING &&
                            "Following"
                        }
                    </h1>

                    <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-0 bottom-0 my-auto right-3" onClick={closeModal}>
                        <X className="w-5" />
                    </button>
                </div>

                {/* content */}
                <div className="px-4 py-2">
                    {/* search input */}
                    <form className="flex items-center bg-neutral-800 h-10 rounded-xl">
                        <input className="flex-1 h-full default-input-text-behaviour px-3 text-sm text-neutral-300" placeholder="Search..."></input>
                        <button className="h-full w-8 group">
                            <Search className="w-4 group-hover:text-neutral-400 cursor-pointer" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default UserFollowListModal;