import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full flex justify-center px-10 md:px-0">
            <div className="w-full justify-center text-center py-6 flex flex-col-reverse md:flex-row items-center space-x-5 text-sm md:text-base text-neutral-200 gap-y-3">
                <span>
                    &copy; { new Date().getFullYear() } odiano 
                </span>
                <div className="flex justify-center items-center flex-wrap space-x-5">
                    <div className="w-px h-4 bg-neutral-50 hidden md:flex"></div>
                    <Link to="#" className="hover:text-rose-500 duration-100">privacy policy</Link>
                    <div className="w-px h-4 bg-neutral-50 hidden md:flex"></div>
                    <Link to="#" className="hover:text-rose-500 duration-100">terms of services</Link>
                    <div className="w-px h-4 bg-neutral-50 hidden md:flex"></div>
                    <Link to="#" className="hover:text-rose-500 duration-100">cookie use</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer;