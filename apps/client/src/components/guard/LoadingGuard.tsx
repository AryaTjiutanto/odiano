import { useEffect, useRef, useState } from "react";
import Loading from "../loader/PageLoader";
import { Navigate, Outlet } from "react-router-dom";
import type { GuardResult } from "../../types/guard.type";

type GuardProps = {
    result : GuardResult
}

const LoadingGuard = (props : GuardProps) => {
    const result = props.result;
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);
    const [fallbackRoute, setFallbackRoute] = useState<string | null>(null);

    const startRef = useRef(0);

    useEffect(() => {
        startRef.current = Date.now();

        if (result.isLoading) {
            return;
        }

        if (result.allowed === true) {
            setIsAllowed(true);
        } else {
            setFallbackRoute(result.redirectTo);
            setIsAllowed(false);
        }
    }, [result.isLoading, result.allowed, result.redirectTo]);

    useEffect(() => {
        if(isAllowed === null) return;
        
        const elapsed = Date.now() - startRef.current;
        const remaining = 700 - elapsed;
        const delay = remaining > 0 ? remaining : 0;

        let timeout1 : ReturnType<typeof setTimeout>;
        let timeout2 : ReturnType<typeof setTimeout>;

        if (isAllowed === false) {
            timeout1 = setTimeout(() => {
                setIsLoading(false);
            }, delay);

            return () => clearTimeout(timeout1);
        }

        timeout2 = setTimeout(() => {
            setIsLoaderVisible(false);

            setTimeout(() => {
                setIsLoading(false);
            }, 150)
        }, delay);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        }
    }, [isAllowed]);

    // loading
    if (isLoading) {
        return <Loading visible={isLoaderVisible}></Loading>
    }

    // if not authenticated, redirect to login
    if (!isAllowed) {
        return <Navigate to={`${fallbackRoute || ''}`} replace/>
    }

    // success
    return <Outlet />
}

export default LoadingGuard;