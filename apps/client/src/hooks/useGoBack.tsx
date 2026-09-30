import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { useRef } from "react";

const useGoBack = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isNavigating = useRef(false);
    
    return () => {
        // if(isNavigating.current) return;
        // isNavigating.current = true;
        
        // const prevRoute = String(routes.at(-2));
        
        // if (prevRoute == location.pathname || !prevRoute) {
        //     navigate("/");
        //     return
        // }
        
        // dispatch(removeRouteFromBack(2));
        // navigate(-1);
    }
}

export default useGoBack