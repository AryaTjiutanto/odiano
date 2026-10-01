import { Lock } from "lucide-react";
import connectLogo from "../../assets/img/logo/odiano-full.webp";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAppSelector } from "../../hooks/useRedux";

const PageLoader = ({ children }: { children: ReactNode }) => {
    const { isAuthLoading, isInitialized } = useAppSelector(state => state.auth);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);

    const startRef = useRef(0);

    useEffect(() => {
        if (isAuthLoading && !isInitialized) return;

        const elapsed = Date.now() - startRef.current;
        const remaining = 700 - elapsed;
        const delay = remaining > 0 ? remaining : 0;

        const timeout1 = setTimeout(() => {
            setIsLoaderVisible(false);

            setTimeout(() => {
                setIsLoading(false);
            }, 150)
        }, delay);

        return () => {
            clearTimeout(timeout1);
        }
    }, [isAuthLoading, isInitialized]);

    if (isLoading) {
        return (
            <div className={`w-full h-screen fixed top-0 left-0 z-9999 bg-black duration-150 text-white ${isLoaderVisible ? "opacity-100" : "opacity-0"} grid place-content-center relative`} >
                <img src={connectLogo} className="w-32" />

                <div className="absolute bottom-16 w-full flex items-center justify-center text-neutral-400 space-x-3 px-10 text-center">
                    <Lock className="w-4 hidden md:flex" />
                    <span>
                        Your sensitive data is protected with encryption
                    </span>
                </div>
            </div>
        )
    }

    return <>
        {children}
    </>
}

export default PageLoader;