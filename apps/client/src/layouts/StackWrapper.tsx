import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useStackProvider } from "../providers/StackProvider";

type Props = {
    isTop: boolean,
}

const StackWrapper = ({ isTop }: Props) => {
    const location = useLocation();
    const { stack } = useStackProvider();
    
    useLayoutEffect(() => {
        const currentStack = stack[stack.length - 1];
        window.scrollTo(0, currentStack.scrollY);

    }, [location, stack]);

    return (
        <div className={`${isTop ? "" : "hidden"} w-full h-full`}>
            <Outlet />
        </div>
    )
}

export default StackWrapper;