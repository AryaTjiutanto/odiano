import { Navigate, Outlet } from "react-router-dom";
import type { GuardResult } from "../../types/guard.type";

type Props = {
    result : GuardResult
}

const GuardExecuter = ({result} : Props) => {
    if (!result.isLoading && result.allowed) {
        return <Outlet />
    }

    if (!result.isLoading && !result.allowed) {
        return <Navigate to={result.redirectTo ?? "/"} replace />
    }
}

export default GuardExecuter;