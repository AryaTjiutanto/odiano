import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type StackType = {
    location: ReturnType<typeof useLocation>,
    key: string,
}

type StackContextType = {
    stack: StackType[],
    pop: () => void,
}

const StackContext = createContext<StackContextType | null>(null);

export const StackProvider = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [stack, setStack] = useState<StackType[] | []>([]);

    useEffect(() => {
        setStack(prev => {
            const index = prev.findIndex(item => item.location.pathname == location.pathname);

            if (index > -1) {
                return [...prev.slice(0, index + 1)];
            }

            return [...prev, {
                location : location,
                key : location.key || Date.now().toString(),
            }]
        })
    }, [location]);

    const pop = () => {
        navigate(-1);
    }

    return (
        <StackContext.Provider value={{ stack, pop }}>
            {children}
        </StackContext.Provider>
    )
}

export const useStack = () => {
    const context = useContext(StackContext);

    if (!context) {
        throw new Error("useStack must be used within a StackProvider");
    }

    return context;
}