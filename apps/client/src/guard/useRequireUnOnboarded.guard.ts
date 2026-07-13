import { useAppSelector } from "../hooks/useRedux";
import type { GuardResult } from "../types/guard.type";

const useRequireUnOnboarded = (): GuardResult => {
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);

    if(!isInitialized) {
        return {
            isLoading : true,
            allowed : false,
            redirectTo : ""
        }
    }

    if(!isAuthenticated) {
        return {
            isLoading :false,
            allowed : false,
            redirectTo : "signin"
        }
    }

    if(user?.isOnboarded) {
        return {
            isLoading :false,
            allowed : false,
            redirectTo : `profile/${user.username}`
        }
    }

    return {
        isLoading : false,
        allowed : true,
        redirectTo : ""
    }
}

export default useRequireUnOnboarded;