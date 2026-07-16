import axios from "axios";
import { ERROR_RESPONSE_CODE, type ErrorResponseCode } from "@connect/shared";
import type { AllErrorResponse } from "../../types/response.type";
import { notify } from "../notification/notify.helper";
import TooManyRequestCountDown from "../../components/counter/TooManyRequestCountDown";
import { handleApiValidationError } from "./apiValidationError.helper";
import type { FieldValues, UseFormSetError } from "react-hook-form";

type NotificationOverride = {
    title? : string,
    description? : string,
}

type HandleApiErrorNotificationOptions <T extends FieldValues> = {
    defaultTitle? : string,
    defaultDescription? : string,

    notifications? : Partial<Record<ErrorResponseCode, NotificationOverride>>,

    setValidationError? : UseFormSetError<T>, 
};

export const handleApiErrorNotification = <T extends FieldValues> (
    err: unknown,
    options?: HandleApiErrorNotificationOptions<T>,
) => {
    if (!axios.isAxiosError<AllErrorResponse>(err)) {
        notify.error({
            title: options?.defaultTitle ?? "Unexpected Error",
            description:
                options?.defaultDescription ??
                "Something went wrong. Please try again.",
        });

        return;
    }

    const error = err.response?.data;

    if (!error) {
        notify.error({
            title: options?.defaultTitle ?? "Unexpected Error",
            description:
                options?.defaultDescription ??
                "Something went wrong. Please try again.",
        });

        return;
    }

    const custom = options?.notifications?.[error.code];

    switch (error.code) {
        case ERROR_RESPONSE_CODE.tooManyRequests: {
            if (error.errors?.timeLeftMs) {
                notify.error({
                    title: custom?.title ?? "Too Many Requests",
                    element: (
                        <TooManyRequestCountDown
                            show="auto"
                            timeLeftMs={error.errors.timeLeftMs}
                        />
                    ),
                });

                return;
            }

            notify.error({
                title: custom?.title ?? "Too Many Requests",
                description:
                    custom?.description ??
                    "Please wait a moment before trying again.",
            });

            return;
        }

        case ERROR_RESPONSE_CODE.validationError:
            if(options?.setValidationError) {
                handleApiValidationError(error.errors, options?.setValidationError);
            } else {
                notify.error({
                    title: custom?.title ?? "Validation Error",
                    description:
                        custom?.description ??
                        "Please check your input and try again.",
                });
            }

            return;

        case ERROR_RESPONSE_CODE.forbidden:
            notify.error({
                title: custom?.title ?? "Forbidden",
                description: custom?.description ?? error.message ?? "You don't have permission to perform this action",
            });
            return;

        case ERROR_RESPONSE_CODE.unauthorized:
            notify.error({
                title: custom?.title ?? "Unauthorized",
                description:
                    custom?.description ??
                    "Please sign in and try again.",
            });
            return;

        case ERROR_RESPONSE_CODE.conflict:
            notify.error({
                title: custom?.title ?? "Conflict",
                description:
                    custom?.description ??
                    error.message ??
                    "The request conflicts with existing data.",
            });
            return;

        case ERROR_RESPONSE_CODE.badRequest:
            notify.error({
                title: custom?.title ?? "Bad Request",
                description:
                    custom?.description ??
                    error.message ??
                    "The request could not be processed.",
            });
            return;

        default:
            notify.error({
                title: options?.defaultTitle ?? "Unexpected Error",
                description:
                    options?.defaultDescription ??
                    error.message ??
                    "Something went wrong. Please try again.",
            });
    }
};