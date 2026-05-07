import { useAppSelector } from "../shared/hooks/useRedux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../components/ui/PageLoader";
import { useEffect, useRef, useState } from "react";

const RequireAuth = () => {
    const location = useLocation();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);

    const isAuthLoading = useAppSelector(state => state.auth.isAuthLoading);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const userData = useAppSelector(state => state.auth.user);

    const startRef = useRef(0);

    useEffect(() => {
        startRef.current = Date.now();
    }, []);

    useEffect(() => {
        if(!isAuthLoading) {
            const elapsed = Date.now() - startRef.current;
            const remaining = 700 - elapsed;
            const delay = remaining > 0 ? remaining : 0;
            
            if(!isAuthenticated) {
                setTimeout(() => {
                    setIsLoading(false);

                    return;
                }, delay);
            }

            setTimeout(() => {
                setIsLoaderVisible(false);
                
                setTimeout(() => {
                    setIsLoading(false);
                }, 150)
            }, delay);
        }
    }, [isInitialized]);

    // loading
    if(isLoading) {
        return <Loading visible={isLoaderVisible}></Loading>
    }

    // if not authenticated, redirect to login
    if(!isAuthenticated && !isLoading) {
        return <Navigate to={"/signin"} replace/>
    }

    // if not boarded, redirect to onboarding page
    if(userData && !userData.isOnboarded && location.pathname != "/onboarding") {
        return <Navigate to={"/onboarding"} replace/>
    }
    
    // if boarded and access onboarding page
    if(userData && userData.isOnboarded && location.pathname == "/onboarding") {
        return <Navigate to={"/profile"} replace/>
    }
    
    // success
    return <Outlet/>
}

export default RequireAuth;