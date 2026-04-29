import { useSelector } from "react-redux";
import { useAppSelector } from "../shared/hooks/useRedux";

const RequireAuth = () => {
    const isLoading = useAppSelector(state => state.auth.isAuthLoading);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
}

export default RequireAuth;