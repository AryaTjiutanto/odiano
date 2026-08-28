import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

const RequireUnVerify = () => {
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
    if (user && user.isEmailVerified) {
        return <Navigate to="/onboarding" replace />
    }

    return <Outlet/>
}

export default RequireUnVerify;