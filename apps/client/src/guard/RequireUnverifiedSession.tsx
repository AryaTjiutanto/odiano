import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

const RequireUnverifiedSession = () => {
    const {isRequireVerification, isInitialized, isAuthenticated, user} = useAppSelector((state) => state.auth);

    if(!isInitialized) {
        return null;
    }


    if(!isRequireVerification && !isAuthenticated) {
        return <Navigate to={`/signin`}/>;
    }

    if(!isRequireVerification && isAuthenticated) {
        return <Navigate to={`/profile/${user?.username}`}/>;
    }

    return <Outlet/>
}

export default RequireUnverifiedSession;