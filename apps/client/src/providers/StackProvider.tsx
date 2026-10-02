import { createContext, useContext, useEffect, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type StackType = {
    location: ReturnType<typeof useLocation>,
    key: string,
    scrollY : number,
}

type StackContextType = {
    stack: StackType[],
    pop: () => void,
    setCurrentStackScrollY : (position : number) => void,
    pushStack : (e : React.MouseEvent<HTMLAnchorElement, MouseEvent>, to: string) => void,
    resetStack : () => void,
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
                const data = [...prev.slice(0, index + 1)]
                return data;
            }

            const newData = [...prev, {
                location : location,
                key : location.key || Date.now().toString(),
                scrollY : 0,
            }]

            return newData;
        })
    }, [location]);

    const setCurrentStackScrollY = (position : number) => {
        setStack(prev => {
            if(prev.length == 0) return prev;

            const updatedData = [...prev];
            updatedData[updatedData.length - 1].scrollY = position;

            return updatedData;
        })  
    };

    const resetStack = () => {
        setStack([]);
    }

    const pop = () => {
        navigate(-1);
    }

    function pushStack (e : MouseEvent<HTMLAnchorElement, MouseEvent> | MouseEvent<HTMLButtonElement, MouseEvent>, to: string) {
        e.preventDefault();
        e.stopPropagation();

        setCurrentStackScrollY(window.scrollY);
        navigate(to);
    }

    return (
        <StackContext.Provider value={{ stack, pop, setCurrentStackScrollY, pushStack, resetStack }}>
            {children}
        </StackContext.Provider>
    )
}

export const useStackProvider = () => {
    const context = useContext(StackContext);

    if (!context) {
        throw new Error("useStack must be used within a StackProvider");
    }

    return context;
}