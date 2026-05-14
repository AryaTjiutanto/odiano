import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../shared/hooks/useRedux";
import { useEffect } from "react";
import { intitializeAuth } from "../features/auth/auth.thunk";

const AppLayout = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(intitializeAuth());
    }, [])

    return (
        <>
            {/* head */}
            <meta
                name="keywords"
                content="social media, connect, community, posts, friends"
            />
            <meta
                name="author"
                content="Arya Tjiutanto"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />

            {/* body */}
            <div className="w-full max-w-480 min-h-screen bg-neutral-950 text-neutral-300">
                <Outlet />
            </div>
        </>
    )
}

export default AppLayout;