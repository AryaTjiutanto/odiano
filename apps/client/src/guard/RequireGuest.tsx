import { useAppSelector } from "../shared/hooks/useRedux";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/ui/PageLoader";
import { useEffect, useRef, useState } from "react";

const RequireGuest = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);

    const isAuthLoading = useAppSelector(state => state.auth.isAuthLoading);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    const startRef = useRef(0);

    useEffect(() => {
        startRef.current = Date.now();
    }, []);

    useEffect(() => {
        if(!isAuthLoading) {
            const elapsed = Date.now() - startRef.current;
            const remaining = 700 - elapsed;
            const delay = remaining > 0 ? remaining : 0;
            
            if(isAuthenticated) {
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
    }, [isAuthenticated]);
    
    if(isLoading) {
        return <Loading visible={isLoaderVisible}></Loading>
    }

    if(isAuthenticated && !isLoading) {
        return <Navigate to={"/profile"} replace/>
    }


    return <Outlet/>
}

export default RequireGuest;