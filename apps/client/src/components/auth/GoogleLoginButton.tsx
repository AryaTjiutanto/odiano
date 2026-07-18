import { GoogleLogin } from "@react-oauth/google";
import useGoogleAuth from "../../hooks/useGoogleAuth";
const GoogleLoginButton = () => {
    const {handleOnError, handleOnSuccess} = useGoogleAuth();

    return (
        <GoogleLogin onSuccess={handleOnSuccess} onError={handleOnError} size="large" text="continue_with"/>
    )
}

export default GoogleLoginButton;