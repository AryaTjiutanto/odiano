import { useState } from "react";
import connectLogo from "../../assets/img/logo/connect.svg";
import CustomOTPInput from "../../components/input/CustomOTPInput";
import { useAppSelector } from "../../hooks/useRedux";

const EmailVerification = () => {
    const [otp, setOTP] = useState<string>("");
    const userData = useAppSelector((state) => state.auth.user);

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
                        <CustomOTPInput setValue={setOTP} value={otp}/>
                    </div>

                    <button className={`w-full h-11 duration-200 rounded mt-6 border ${otp.length < 6 ? "text-neutral-400 cursor-not-allowed bg-neutral-700 border-neutral-700" : "bg-sky-500 text-neutral-50 border-sky-500 hover:bg-transparent cursor-pointer"}`}>
                        Verify
                    </button>
                    
                    <div className="mt-3">
                        Didn't receive an email ? <button className="font-semibold underline hover:text-sky-500 duration-100 cursor-pointer">Resend</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmailVerification;