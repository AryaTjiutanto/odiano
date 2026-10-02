import { Outlet } from "react-router-dom";

type Props = {
    isTop: boolean,
}

const StackWrapper = ({ isTop }: Props) => {
    return (
        <div className={`${isTop ? "" : "hidden opacity-0 -z-50"} w-full h-full duration-0`}>
            <Outlet />
        </div>
    )
}

export default StackWrapper;