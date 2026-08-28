import type { Role } from "@odiano/shared";
import { useAppSelector } from "../hooks/useRedux";
import { Navigate, Outlet } from "react-router-dom";
import { notify } from "../helpers/notification/notify.helper";
import { useEffect } from "react";

type Props = {
    role : Role,   
}

const RequireRoleGuard = ({role} : Props) => {
    const currentUserRole = useAppSelector(state => state.auth.user?.role);

    const isAuthorize = currentUserRole === role;

    useEffect(() => {
        if(!isAuthorize) {
            notify.error({title : "Forbidden", description : "You don't have permission to access this page"});
        }
    }, [isAuthorize]);

    if(!isAuthorize) {
        return <Navigate to="/signin" replace />
    }

    return <Outlet/>;
}

export default RequireRoleGuard;