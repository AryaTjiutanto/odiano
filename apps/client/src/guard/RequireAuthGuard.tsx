import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

const RequireAuthGuard = () => {
    const location = useLocation();
    const {isAuthLoading, isAuthenticated, isInitialized, user, isSessionVerified} = useAppSelector(state => state.auth);

    if (isAuthLoading || !isInitialized) {
        return null;
    }

    // if not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />
    }

    // is session verified
    if (!isSessionVerified) {
        return <Navigate to="/verify" replace/>
    }

    // is email verified
    if (user && !user.isEmailVerified) {
        return <Navigate to="/email/verify" replace />
    }

    // if not boarded, redirect to onboarding page
    if (user && !user.isOnboarded && location.pathname != "/onboarding") {
        return <Navigate to="/onboarding" replace />
    }

    return <Outlet />
}

export default RequireAuthGuard;