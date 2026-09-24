import { ERROR_RESPONSE_CODE, type ErrorResponseData } from "@odiano/shared";
import type { AxiosError } from "axios";
import ErrorState from "../common/ErrorState";

type Props = {
    queryError: unknown
}

const ProfileError = ({ queryError }: Props) => {
    const error = queryError as AxiosError<ErrorResponseData>;
    const response = error.response;

    if (response?.data.code == ERROR_RESPONSE_CODE.notFound) {
        return (
            <div className="w-full h-full grid place-content-center">
                <ErrorState
                    title="This User isn't available"
                    description="User may have been deleted or change the username."
                    fontSize="small"
                />
            </div>
        )
    }

    return <></>
}

export default ProfileError;