import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/auth.thunk";
import { useStackProvider } from "../providers/StackProvider";
import { useAppDispatch } from "./useRedux";

export const useLogout = () => {
    const dispatch = useAppDispatch();
    const { resetStack } = useStackProvider();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await dispatch(logout());
        resetStack();
        navigate("/signin");
    }
    
    return {
        logoutHandler,
    };
};