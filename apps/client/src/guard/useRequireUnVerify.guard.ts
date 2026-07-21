import { useAppSelector } from "../hooks/useRedux";
import type { GuardResult } from "../types/guard.type";

const useRequireUnVerify = (): GuardResult => {
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);

    if (!isInitialized) {
        return {
            isLoading: true,
            allowed: false,
            redirectTo: ""
        }
    }

    if (!isAuthenticated) {
        return {
            isLoading: false,
            allowed: false,
            redirectTo: "/signin"
        }
    }

    // is email verified
    if (user && user.isEmailVerified) {
        return {
            isLoading: false,
            allowed: false,
            redirectTo: "/onboarding",
        }
    }

    return {
        isLoading: false,
        allowed: true,
        redirectTo: ""
    }
}

export default useRequireUnVerify;