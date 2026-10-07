import { LayoutDashboard, X } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "../../../providers/DashboardProvider";

const Sidebar = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useDashboard();
    const [activeTab, setActiveTab] = useState('dashboard');

    const navigation = [
        { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
        // { name: 'Users', id: 'users', icon: Users },
        // { name: 'Products', id: 'products', icon: ShoppingBag },
        // { name: 'Analytics', id: 'analytics', icon: BarChart3 },
        // { name: 'Settings', id: 'settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r px-4 py-7 bg-white transition-transform duration-200 ease-in-out border-neutral-800 dark:bg-black lg:static lg:tranneutral-x-0 ${isSidebarOpen ? 'tranneutral-x-0' : '-tranneutral-x-full'
                }`}>

                <button
                    className="lg:hidden text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <X className="h-6 w-6" />
                </button>

                {/* account info */}
                <div className="flex items-center gap-3 border-l pl-4 border-neutral-900">
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="hidden md:block">
                        <p className="text-base font-medium">Jane Doe</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Admin</p>
                    </div>
                </div>
                
                {/* navigations */}
                <nav className="mt-6 space-y-2 px-4">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${isActive
                                    ? 'text-neutral-900 bg-neutral-100 text-neutral-00'
                                    : ' text-neutral-100 hover:bg-neutral-800/50'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    )
}

export default Sidebar;