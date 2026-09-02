import { Outlet } from "react-router-dom";
import { DashboardProvider } from "../providers/DashboardProvider";
import Sidebar from "../components/admin/Dashboard/Sidebar";

const DashboardLayout = () => {
    return (
        <DashboardProvider>
            <div className="flex h-screen bg-black font-sans text-neutral-100">
                {/* Main Content Area */}
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Dashboard View */}
                    <main className="flex-1 overflow-y-auto p-6">
                        <Outlet/>
                    </main>
                </div>
            </div>
        </DashboardProvider>
    )
}

export default DashboardLayout;