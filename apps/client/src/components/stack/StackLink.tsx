import type { MouseEvent, ReactNode } from "react"
import { Link } from "react-router-dom"
import { useStackProvider } from "../../providers/StackProvider";

type Props = {
    children: ReactNode,
    to: string,
    onClick? : () => void,
}

const StackLink = ({ children, to,  onClick}: Props) => {
    const {pushStack} = useStackProvider();

    const clickHandler = (e : MouseEvent<HTMLAnchorElement>) => {
        if(onClick) onClick();

        return pushStack(e, to)
    }

    return (
        <Link to={to} onClick={clickHandler} className="cursor-pointer">
            {children}
        </Link>
    )
}

export default StackLink;