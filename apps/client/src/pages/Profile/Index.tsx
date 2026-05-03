import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/auth.thunk";
import { useAppDispatch } from "../../shared/hooks/useRedux";

const ProfileIndex = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const logoutHandler = () => {
        dispatch(logout());
        navigate("/signin");
    }

    return (
        <div className="w-full min-h-screen bg-neutral-950 text-neutral-200">
            <p>
                You already logged in
            </p>
            <button onClick={logoutHandler} className="cursor-pointer">
                Logout
            </button>
        </div>
    )
}

export default ProfileIndex;