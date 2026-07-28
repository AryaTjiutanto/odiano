import { Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createUserSchema, type CreateUserSchema, type AuthenticationResponse, type SuccessResponseData } from "@odiano/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import DotsLoader from "../../components/loader/DotsLoader";
import { api } from "../../libs/api";
import { useAppDispatch } from "../../hooks/useRedux";
import { setAccessToken } from "../../features/auth/auth.slice";
import { intitializeAuth } from "../../features/auth/auth.thunk";
import { handleApiErrorNotification } from "../../helpers/errors/apiError.helper";
import DateInputSection from "../../components/input/DateInputSection";

const Signup = () => {
    const dispatch = useAppDispatch();

    const {
        register,
        setError,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CreateUserSchema>({
        mode: "onTouched",
        resolver: zodResolver(createUserSchema)
    })

    const onSubmit: SubmitHandler<CreateUserSchema> = async (data) => {
        try {
            const response = await api.post<SuccessResponseData<AuthenticationResponse>>("/auth/signup", data);

            const accessToken = response.data.data?.access_token;

            if (accessToken) {
                dispatch(setAccessToken(accessToken));
                dispatch(intitializeAuth());
            }
        } catch (err: unknown) {
            handleApiErrorNotification<CreateUserSchema>(err, {
                setValidationError: setError
            });
        }
    }

    return (
        <>
            {/* head */}
            <title>Create an account - odiano</title>
            <meta
                name="description"
                content="odiano with friends, share posts, and explore communities."
            />

            {/* body */}
            <div className="w-full min-h-screen flex justify-start md:justify-center items-center pt-32 pb-12 2xl:pt-0 2xl:pb-0 px-10 md:px-0">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[560px]">
                    {/* singin */}
                    <h1 className="text-3xl font-bold md:text-center 2xl:text-left">
                        Create your account
                    </h1>
                    <div className="w-full flex flex-col space-y-5 mt-6 md:mt-10">
                        {/* email */}
                        <div>
                            <input className="w-full h-12 border border-neutral-200 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="email" placeholder="youremail@email.com" {...register("email")}></input>
                            {
                                errors.email &&
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.email.message}
                                </p>
                            }
                        </div>
                        {/* password */}
                        <div>
                            <input className="w-full h-12 border border-neutral-200 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="password" placeholder="password" {...register("password")}></input>
                            {
                                errors.password &&
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.password.message}
                                </p>
                            }
                        </div>
                        {/* date of birthday */}
                        <div>
                            <DateInputSection setDate={(date : string) => {
                                setValue("dateOfBirth", date, {
                                    shouldDirty : true,
                                    shouldTouch : true,
                                    shouldValidate : true,
                                });
                            }} />
                            {
                                errors.dateOfBirth &&
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.dateOfBirth.message}
                                </p>
                            }
                        </div>

                        <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 grid place-content-center rounded-lg duration-150 cursor-pointer mt-10" disabled={isSubmitting}>
                            {
                                isSubmitting ?
                                    <DotsLoader />
                                    :
                                    <span>
                                        create
                                    </span>
                            }
                        </button>
                        <div className="mt-4 text-sm text-neutral-300">
                            By signing up, you agree to the <Link to={"#"} className="underline hover:text-sky-500 duration-100">Terms of Service</Link> and <Link to={"#"} className="underline hover:text-sky-500 duration-100">Privacy Policy</Link>, including <Link to={"#"} className="underline hover:text-sky-500 duration-100">Cookie Use</Link>.
                        </div>
                    </div>

                    {/* signin */}
                    <div className="w-full mt-8 md:mt-16 2xl:mt-32">
                        <h1 className="text-xl 2xl:text-2xl font-bold">Already have an account?</h1>
                        <Link to={"/signin"}>
                            <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer mt-5">
                                Signin
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Signup; 