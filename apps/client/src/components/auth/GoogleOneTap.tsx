import { useGoogleOneTapLogin } from "@react-oauth/google";
import useGoogleAuth from "../../hooks/useGoogleAuth";
import { useAppSelector } from "../../hooks/useRedux";

const GoogleOneTap = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    const isInitialized = useAppSelector((state) => state.auth.isInitialized) 

    const {handleOnError, handleOnSuccess} = useGoogleAuth();

    useGoogleOneTapLogin({
        onSuccess : handleOnSuccess,
        onError : handleOnError,
        disabled : !isInitialized || isAuthenticated
    })

    return null;
}

export default GoogleOneTap;