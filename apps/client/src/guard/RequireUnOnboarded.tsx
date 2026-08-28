import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

const RequireUnOnboarded = () => {
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);

    if (!isInitialized) {
        return null
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />
    }

    // is email verified
    if (user && !user.isEmailVerified) {
        return <Navigate to="/email/verify" replace />
    }

    if (user?.isOnboarded) {
        return <Navigate to={`/profile/${user.username}`} replace />
    }

    return <Outlet/>
}

export default RequireUnOnboarded;