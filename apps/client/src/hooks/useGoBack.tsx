import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../shared/hooks/useRedux";
import { removeRouteFromBack } from "../features/navigationHistory/navigationHistory.slice";

const useGoBack = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const routes = useAppSelector((state) => state.navigationHistory.routeHistory);

    return () => {
        const prevRoute = String(routes.at(-2));
    
        if (prevRoute == location.pathname) {
            navigate("/");
            return
        }
    
        dispatch(removeRouteFromBack(2));
        navigate(prevRoute);
    }
}

export default useGoBack