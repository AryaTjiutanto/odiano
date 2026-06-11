import { useAppSelector } from "../shared/hooks/useRedux";
import type { GuardResult } from "../types/guard.type";

const useRequireGuest = (): GuardResult => {
    const isAuthLoading = useAppSelector(state => state.auth.isAuthLoading);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const userData = useAppSelector(state => state.auth.user);

    if (isAuthLoading || !isInitialized) {
        return {
            isLoading: true,
            allowed: false,
            redirectTo: ""
        }
    }

    if (isAuthenticated) {
        return {
            isLoading: false,
            allowed: false,
            redirectTo: `/profile/${userData && userData?.username}`
        }
    }

    return {
        isLoading: false,
        allowed: true,
        redirectTo: ""
    }
}

export default useRequireGuest;