import { Outlet } from "react-router-dom";
import Sidebar from "../components/social/Sidebar";


const SocialLayout = () => {
    return (
        <div className="w-full h-screen px-40">
            <div className="w-full h-full grid grid-cols-11 gap-16">
                <div className="h-full col-span-3 py-10">
                    <Sidebar/>           
                </div>
                <main className="col-span-5 pt-10">
                    <Outlet />
                </main>
                <div className="col-span-3 pt-10">

                </div>
            </div>
        </div>
    )
}

export default SocialLayout;