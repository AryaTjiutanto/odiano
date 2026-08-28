import { Outlet } from "react-router-dom";
import { DashboardProvider } from "../providers/DashboardProvider";
import Sidebar from "../components/admin/Dashboard/Sidebar";

const DashboardLayout = () => {
    return (
        <DashboardProvider>
            <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100">
                {/* Main Content Area */}
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Dashboard View */}
                    <main className="flex-1 overflow-y-auto p-6">
                        <Outlet/>
                    </main>
                </div>
            </div>
            <Outlet />
        </DashboardProvider>
    )
}

export default DashboardLayout;