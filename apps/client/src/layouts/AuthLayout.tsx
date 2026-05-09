import { Link, Outlet } from "react-router-dom";
import Footer from "../components/auth/Footer";
import connectLogo from "../assets/img/logo/connect-gradient.svg";

const AuthLayout = () => {
    return (
        <div className="dark:bg-neutral-950 w-full h-full text-neutral-100 selection:bg-pink-500">
            <div className="w-full max-w-[1650px] mx-auto min-h-screen">
                <Link to={""}>
                    <div className="flex items-center space-x-10 absolute top-10 md:top-12 2xl:top-20 left-12 md:left-20 2xl:left-28">
                        <img src={connectLogo} className="w-16 md:w-fit"></img>
                        <span className="hover:text-rose-500 duration-100 hidden md:inline-block">
                            Go back to homepage
                        </span>
                    </div>
                </Link>
                <div className="h-full">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AuthLayout;