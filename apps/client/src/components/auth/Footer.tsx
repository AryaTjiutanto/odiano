import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full flex justify-center">
            <div className="w-full justify-center text-center py-6 flex items-center space-x-5">
                <span>
                    &copy; { new Date().getFullYear() } connect 
                </span>
                <div className="w-px h-4 bg-neutral-50"></div>
                <Link to="#" className="hover:text-rose-500 duration-100">privacy policy</Link>
                <div className="w-px h-4 bg-neutral-50"></div>
                <Link to="#" className="hover:text-rose-500 duration-100">terms of services</Link>
                <div className="w-px h-4 bg-neutral-50"></div>
                <Link to="#" className="hover:text-rose-500 duration-100">cookie use</Link>
            </div>
        </footer>
    )
}

export default Footer;