import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../hooks/useRedux";
import { useEffect } from "react";
import { intitializeAuth } from "../features/auth/auth.thunk";
import { Toaster } from "react-hot-toast";

const AppLayout = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(intitializeAuth());
    }, [dispatch])

    return (
        <>
            {/* head */}
            <meta
                name="keywords"
                content="social media, odiano, community, posts, friends"
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
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            
            <div className="w-full max-w-480 min-h-screen bg-black text-neutral-100">
                <Outlet />
            </div>
        </>
    )
}

export default AppLayout;