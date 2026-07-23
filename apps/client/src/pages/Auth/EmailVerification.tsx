import { useState } from "react";
import connectLogo from "../../assets/img/logo/connect.svg";
import CustomOTPInput from "../../components/input/CustomOTPInput";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import DotsLoader from "../../components/loader/DotsLoader";
import { notify } from "../../helpers/notification/notify.helper";
import { api } from "../../libs/api";
import type { SuccessResponseData } from "@connect/shared";
import { useNavigate } from "react-router-dom";
import { setEmailVerified } from "../../features/auth/auth.slice";

const EmailVerification = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const userData = useAppSelector((state) => state.auth.user);
    const [isResending, setIsResending] = useState<boolean>(false);

    const handleResendOTP = async () => {
        if(isResending) return;

        try {
            setIsResending(true);

            await api.post("/auth/email-verification/resend");

            notify.info({ title: "OTP sent", description: "Please check your email for the OTP." });
        } catch (err: unknown) {
            handleApiErrorNotification(err);
        } finally {
            setIsResending(false);
        }
    }

    // verify otp
    const [isLoading, setIsloading] = useState<boolean>(false);

    const handleVerifyOTP = async (value : string) => {
        if (value.length < 6 || isLoading) return;

        setIsloading(true);

        try {
            const response = await api.post<SuccessResponseData>("/auth/email-verification/verify", {
                code: value,
            });

            if(response.data.success) {
                dispatch(setEmailVerified(true));
                navigate("/onboarding");
            }
        } catch (err : unknown) {
            handleApiErrorNotification(err);
        } finally {
            setIsloading(false);
        }
    }

    // handle otp input
    const [otp, setOTP] = useState<string>("");
    
    const handleOTPChange = (value: string) => {
        if (value.length <= 6) {
            setOTP(value);
        }

        if (value.length === 6) {
            handleVerifyOTP(value);
        }
    }

    return (
        <>
            <title>Email verification - Connect</title>

            <div className="w-screen h-screen grid place-content-center">
                <div className="flex flex-col items-center justify-center">
                    <img src={connectLogo} />
                    <h1 className="mt-7 text-3xl font-bold">Please Check your email</h1>
                    <p className="mt-3 text-neutral-400">
                        We have sent an OTP to <b className="text-neutral-200">{userData?.email}</b>
                    </p>

                    <div className="mt-7">
                        <CustomOTPInput isLoading={(isLoading || isResending)} setValue={handleOTPChange} value={otp} />
                    </div>

                    <button className={`w-full h-11 duration-200 rounded mt-6 border ${(otp.length < 6 && !isLoading) ? "text-neutral-400 cursor-not-allowed bg-neutral-700 border-neutral-700" : "bg-sky-500 text-neutral-50 border-sky-500 hover:bg-transparent cursor-pointer"} ${(isLoading || isResending) && "pointer-events-none"} grid place-content-center`} disabled={isLoading} onClick={() => handleVerifyOTP(otp)}>
                        {
                            (isLoading || isResending) ?
                                <DotsLoader />
                                :
                                "Verify"
                        }
                    </button>

                    <div className="mt-3">
                        Didn't receive an email ? <button className="font-semibold underline hover:text-sky-500 duration-100 cursor-pointer" onClick={() => handleResendOTP()}>Resend</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmailVerification;