import { Lock } from "lucide-react";
import connectLogo from "../../assets/img/logo/connect-full.webp";

const PageLoader = ({visible} : {visible : boolean}) => {
    return (
        <div className={`w-full h-screen bg-neutral-950 duration-150 text-white ${visible ? "opacity-100" : "opacity-0"} grid place-content-center relative`}>
            <img src={connectLogo} className="w-32"/>

            <div className="absolute bottom-16 w-full flex items-center justify-center text-neutral-400 space-x-3 px-10 text-center">
                <Lock className="w-4 hidden md:flex"/>
                <span>
                    Your sensitive data is protected with encryption
                </span>
            </div>
        </div>  
    )
}

export default PageLoader;