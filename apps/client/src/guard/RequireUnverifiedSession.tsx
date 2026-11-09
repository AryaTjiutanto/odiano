import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

const RequireUnverifiedSession = () => {
    const {isSessionVerified, isInitialized, isAuthenticated, user} = useAppSelector((state) => state.auth);

    console.log(isSessionVerified);

    if(!isInitialized) {
        return null;
    }

    if(!isAuthenticated) {
        return <Navigate to="/signin"/>;
    }

    if(isSessionVerified) {
        return <Navigate to={`/profile/${user?.username}`}/>;
    }

    return <Outlet/>
}

export default RequireUnverifiedSession;