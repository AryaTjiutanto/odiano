import { useAppSelector } from "../hooks/useRedux";
import { useLocation } from "react-router-dom";
import type { GuardResult } from "../types/guard.type";

const useRequireAuth = () : GuardResult => {
    const location = useLocation();

    const isAuthLoading = useAppSelector(state => state.auth.isAuthLoading);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const userData = useAppSelector(state => state.auth.user);


    if(isAuthLoading || !isInitialized) {
        return {
            isLoading : true,
            allowed : false,
            redirectTo : ""
        }
    }

    // if not authenticated, redirect to login
    if(!isAuthenticated) {
        return {
            isLoading : false,
            allowed : false,
            redirectTo : "/signin"
        }
    }

    // is email verified
    if(userData && !userData.isEmailVerified) {
        return {
            isLoading : false,
            allowed : false,
            redirectTo : "/email/verify",
        }
    }

    // if not boarded, redirect to onboarding page
    if(userData && !userData.isOnboarded && location.pathname != "/onboarding") {
        return {
            isLoading : false,
            allowed : false,
            redirectTo : "/onboarding"
        }
    }
    
    return {
            isLoading : false,
            allowed : true,
            redirectTo : ""
        }
}

export default useRequireAuth;