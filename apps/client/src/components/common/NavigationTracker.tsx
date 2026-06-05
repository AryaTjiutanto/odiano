import { useEffect } from "react";
import { addRoute } from "../../features/navigationHistory/navigationHistory.slice";
import { useAppDispatch } from "../../shared/hooks/useRedux";
import { useLocation } from "react-router-dom";

const NavigationTracker = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(addRoute(location.pathname + location.search));
    }, [location.pathname, location.search]);

    return null;
}

export default NavigationTracker;