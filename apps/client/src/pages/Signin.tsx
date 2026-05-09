import loginImage from "../assets/img/login-img.webp";
import googleLogo from "../assets/img/logo/google.svg";
import { Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AUTH_TOKEN, authenticateUserSchema, type SuccessResponseData, type AuthenticateUserSchema, type ErrorResponseData, type SignInResponse, type ValidationError } from "@connect/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../libs/api";
import { useAppDispatch } from "../shared/hooks/useRedux";
import { setAccessToken } from "../features/auth/auth.slice";
import DotsLoader from "../components/loader/DotsLoader";
import { useState } from "react";
import { intitializeAuth } from "../features/auth/auth.thunk";


const Signin = () => {
    const dispatch = useAppDispatch();
    const [signInErrorMessage, setSignInErrorMessage] = useState<string>("");

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AuthenticateUserSchema>({
        mode: "onTouched",
        resolver: zodResolver(authenticateUserSchema)
    });

    const onSubmit: SubmitHandler<AuthenticateUserSchema> = async (data) => {
        try {
            const response = await api.post<SuccessResponseData<SignInResponse>>("/auth/signin", data);

            const accessToken = response.data.data?.[AUTH_TOKEN.ACCESS];

            if (accessToken) {
                dispatch(setAccessToken(accessToken));
                dispatch(intitializeAuth());
            }
        } catch (err: any) {
            const error = err.response?.data as ErrorResponseData<ValidationError[]>;

            if (error.errors) {
                Object.entries(error.errors).forEach(([index, field]) => {
                    setError(field.path as keyof AuthenticateUserSchema, {
                        type: "server",
                        message: field.message
                    })
                })
            }

            if(error.message && !error.errors) {
                setSignInErrorMessage(error.message);
            }
        }
    }

    return (
        <div className="h-full min-h-screen flex items-center py-32 xl:py-0">
            <div className="w-full grid grid-cols-12 px-10 md:px-20 lg:px-0">
                <div className="w-full lg:col-span-7 hidden xl:flex items-center justify-center">
                    <div className="h-[800px] w-[70%] flex items-center">
                        <img src={loginImage} className="h-fit"></img>
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-5 flex flex-col justify-center items-start md:items-center xl:items-start">
                    <div className="w-fit lg:w-[55vw] xl:w-fit">
                        <h1 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold text-white">
                            Discover what's happening right now
                        </h1>
                        <div className="w-full xl:w-[80%] 2xl:w-[60%] mt-5 2xl:mt-14">
                            {/* sign in */}
                            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                                <h2 className="">Sign in to your account</h2>
                                <div className="mt-5 space-y-5">
                                    <div className="w-full space-y-1">
                                        <input {...register("email")} className="w-full h-12 border border-neutral-200 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="email" placeholder="youremail@gmail.com"></input>
                                        {
                                            errors.email && (
                                                <p className="text-xs text-red-500">{errors.email.message}</p>
                                            )
                                        }
                                    </div>
                                    <div className="w-full space-y-1">
                                        <input {...register("password")} className="w-full h-12 border border-neutral-200 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="password" placeholder="password"></input>
                                        {
                                            errors.password && (
                                                <p className="text-xs text-red-500">{errors.password.message}</p>
                                            )
                                        }
                                    </div>
                                    <div className="space-y-1">
                                        <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer grid place-content-center" disabled={isSubmitting}>
                                            {
                                                isSubmitting ?
                                                    <DotsLoader />
                                                    :
                                                    <div>
                                                        Signin
                                                    </div>
                                            }
                                        </button>
                                        {
                                            signInErrorMessage&&
                                            <p className="text-sm text-red-500">
                                                {signInErrorMessage}
                                            </p>
                                        }
                                        <Link className="text-sm underline hover:text-rose-500 duration-150" to={"#"}>
                                            Forgot password
                                        </Link>
                                    </div>
                                </div>
                            </form>
                            <div className="w-full hidden 2xl:flex items-center justify-between my-8">
                                <div className="w-[45%] h-px bg-neutral-200"></div>
                                <span>or</span>
                                <div className="w-[45%] h-px bg-neutral-200"></div>
                            </div>
                            <div className="mt-5 2xl:mt-10">
                                <button className="w-full bg-white hover:bg-sky-50 h-12 rounded-lg text-neutral-800 cursor-pointer relative duration-100">
                                    <img src={googleLogo} className="absolute top-0 bottom-0 my-auto left-5"></img>
                                    Continue with google
                                </button>
                            </div>

                            {/* sign up */}
                            <div className="w-full mt-12 2xl:mt-16">
                                <h1 className="xl:text-lg 2xl:text-2xl font-bold ">Don't have an account yet?</h1>
                                <Link to={"/signup"} className="mt-5 flex">
                                    <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer">
                                        Create new account
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin;