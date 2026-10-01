import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { useStackProvider } from "../../providers/StackProvider";

type Props = {
    children: ReactNode,
    to: string,
}

const StackLink = ({ children, to }: Props) => {
    const {pushStack} = useStackProvider();

    return (
        <Link to={to} onClick={(e) => pushStack(e, to)} className="cursor-pointer">
            {children}
        </Link>
    )
}

export default StackLink;