import type { CredentialResponse } from "@react-oauth/google";
import { setAccessToken } from "../features/auth/auth.slice";
import { intitializeAuth } from "../features/auth/auth.thunk";
import { handleApiErrorNotification } from "../helpers/errors/apiError.helper";
import { googleAuth } from "../services/auth.service";
import { useAppDispatch } from "./useRedux"
import { notify } from "../helpers/notification/notify.helper";

const useGoogleAuth = () => {
    const dispatch = useAppDispatch();

    const handleOnSuccess = async (CredentialResponse: CredentialResponse) => {
        const { credential } = CredentialResponse;

        if (!credential) {
            throw new Error("Something went wrong");
        }

        try {
            const result = await googleAuth(credential);
            const accessToken = result.data.data?.access_token;
            if (!accessToken) {
                throw new Error("Authentication fail")
            }

            dispatch(setAccessToken(accessToken));
            dispatch(intitializeAuth());
        } catch (err) {
            handleApiErrorNotification(err);
        }
    }

    const handleOnError = () => {
        notify.error({
            title: "Authentication Failed",
            description: "Unable to sign in with Google. Please try again.",
        });
    }

    return {
        handleOnSuccess,
        handleOnError
    }
}

export default useGoogleAuth;