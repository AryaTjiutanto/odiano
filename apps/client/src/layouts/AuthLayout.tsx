import { Link, Outlet } from "react-router-dom";
import Footer from "../components/auth/Footer";
import connectLogo from "../assets/img/logo/connect-gradient.svg";

const AuthLayout = () => {
    return (
        <div className="dark:bg-neutral-950 w-full h-full text-neutral-100 selection:bg-pink-500">
            <div className="w-full max-w-[1650px] mx-auto min-h-screen">
                <div className="flex items-center space-x-10 absolute top-12 2xl:top-20 left-20 2xl:left-28">
                    <img src={connectLogo}></img>
                    <Link to={"#"} className="hover:text-rose-500 duration-100">
                        Go back to homepage
                    </Link>
                </div>
                <div className="h-full">
                    <Outlet/>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AuthLayout;