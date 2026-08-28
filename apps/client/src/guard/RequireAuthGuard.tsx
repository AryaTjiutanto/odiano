import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

const RequireAuthGuard = () => {
    const location = useLocation();

    const isAuthLoading = useAppSelector(state => state.auth.isAuthLoading);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const userData = useAppSelector(state => state.auth.user);


    if (isAuthLoading || !isInitialized) {
        return null;
    }

    // if not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />
    }

    // is email verified
    if (userData && !userData.isEmailVerified) {
        return <Navigate to="/email/verify" replace />
    }

    // if not boarded, redirect to onboarding page
    if (userData && !userData.isOnboarded && location.pathname != "/onboarding") {
        return <Navigate to="/onboarding" replace />
    }

    return <Outlet />
}

export default RequireAuthGuard;