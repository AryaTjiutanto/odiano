import { Link } from "react-router-dom";
import DateDropdown from "../components/ui/DateDropdown";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { createUserSchema, type CreateUserSchema } from "@connect/shared";
import { zodResolver } from "@hookform/resolvers/zod";

const Signup = () => {
    const [dateOfBirth, setDateOfBirth] = useState<string>("");

    const {
        register,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateUserSchema>({
        mode: "onTouched",
        resolver: zodResolver(createUserSchema)
    })

    const onSubmit: SubmitHandler<CreateUserSchema> = (data) => {
        console.log(data);
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center pt-24 pb-12 2xl:pt-0 2xl:pb-0">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[560px]">
                {/* singin */}
                <h1 className="text-3xl font-bold text-center 2xl:text-left">
                    Create your account
                </h1>
                <div className="w-full flex flex-col space-y-5 mt-10">
                    <div>
                        <input className="w-full h-12 border border-neutral-200 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="email" placeholder="youremail@email.com" {...register("email")}></input>
                        {
                            errors.email &&
                            <p className="text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        }
                    </div>
                    <div>
                        <input className="w-full h-12 border border-neutral-200 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="password" placeholder="password"></input>
                        {
                            errors.password &&
                            <p className="text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        }
                    </div>
                    <div>
                        <h2 className="font-bold">
                            Date of birthday
                        </h2>
                        <p className="text-sm text-neutral-300 mt-1">
                            This won’t be shown publicly. We only need your age to set appropriate restrictions.
                        </p>
                        <div className="mt-4 w-full">
                            <DateDropdown setDate={setDateOfBirth} />
                        </div>
                        <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer mt-10">
                            create
                        </button>
                        <div className="mt-4 text-sm text-neutral-300">
                            By signing up, you agree to the <Link to={"#"} className="underline hover:text-rose-500 duration-100">Terms of Service</Link> and <Link to={"#"} className="underline hover:text-rose-500 duration-100">Privacy Policy</Link>, including <Link to={"#"} className="underline hover:text-rose-500 duration-100">Cookie Use</Link>.
                        </div>
                    </div>
                    <input type="hidden" value={dateOfBirth}></input>
                </div>

                {/* signin */}
                <div className="w-full mt-16 2xl:mt-32">
                    <h1 className="text-xl 2xl:text-2xl font-bold">Already have an account?</h1>
                    <Link to={"/signin"}>
                        <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer mt-5">
                            Signin
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Signup; 