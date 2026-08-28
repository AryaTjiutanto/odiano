import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

const RequireGuestGuard = () => {
    const isAuthLoading = useAppSelector(state => state.auth.isAuthLoading);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const userData = useAppSelector(state => state.auth.user);

    if (isAuthLoading || !isInitialized) {
        return null;
    }

    if (isAuthenticated && !userData?.isOnboarded) {
        return <Navigate to="/onboarding" replace />
    }

    if (isAuthenticated) {
        return <Navigate to={`/profile/${userData?.username}`} replace />
    }

    return <Outlet/>
}

export default RequireGuestGuard;