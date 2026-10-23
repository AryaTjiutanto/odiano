import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SEO from "../components/seo/SEO";
import Sidebar from "../components/setting/Sidebar";
import { useEffect } from "react";

const SettingLayout = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();

    useEffect(() => {
        if (window.innerWidth > 640 && pathname == "/settings") {
            navigate("/settings/devices-and-sessions", {
                replace: true,
            });
        }
    }, [navigate, pathname]);

    return (
        <>
            <SEO title="Settings" />
            <div className="w-full grid sm:grid-cols-15 gap-10">
                {/* sidebar */}
                <Sidebar />

                {/* content */}
                <div className="col-span-10 pt-6 sm:pt-6 lg:pt-5 xl:pt-9">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default SettingLayout;