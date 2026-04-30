import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../shared/hooks/useRedux";
import { useEffect } from "react";
import { refreshAccessToken } from "../features/auth/auth.thunk";

const MainLayout = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(refreshAccessToken());
    }, [])

    return (
        <div className="w-full min-h-screen bg-neutral-950">
            <Outlet/>
        </div>
    )
}

export default MainLayout;