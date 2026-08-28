import { Link } from "react-router-dom";

const RightSidebarFooter = () => {
    return (
        <footer className="mt-10 text-sm text-neutral-400">
            <div className="flex flex-wrap items-center gap-2">
                <Link to="#" className="hover:text-sky-500 duration-100">privacy policy</Link>
                <div className="w-1 h-1 rounded-full bg-neutral-400 hidden md:flex"></div>
                <Link to="#" className="hover:text-sky-500 duration-100">terms of services</Link>
                <div className="w-1 h-1 rounded-full bg-neutral-400 hidden md:flex"></div>
                <Link to="#" className="hover:text-sky-500 duration-100">cookie use</Link>
            </div>
            <div className="mt-3 text-sm">
                &copy; {new Date().getFullYear()} ODIANO by <span className="font-bold">Arya Tjiutanto</span>
            </div>
        </footer>
    )
}

export default RightSidebarFooter;