import React from 'react';
import {
    ShoppingBag,    
    TrendingUp,
    DollarSign,
    UserPlus,
    ArrowUpRight
} from 'lucide-react';

// --- Types ---
interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive' | 'Pending';
}

// --- Mock Data ---
const mockUsers: UserData[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'Editor', status: 'Active' },
    { id: '3', name: 'Michael Brown', email: 'michael@example.com', role: 'Viewer', status: 'Pending' },
    { id: '4', name: 'Emma Wilson', email: 'emma@example.com', role: 'Editor', status: 'Inactive' },
];

// --- Helper Components ---
const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon }) => (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-900 dark:bg-black">
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</span>
            <div className="rounded-lg bg-sky-50 p-2 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                <Icon className="h-5 w-5" />
            </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">{value}</h3>
            <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {change}
                <ArrowUpRight className="ml-0.5 h-3 w-3" />
            </span>
        </div>
    </div>
);

// --- Main Admin Panel ---
const HomeAdminDashboard = () => {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Overview</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Welcome back. Here is what is happening today.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Revenue" value="$45,231.89" change="+20.1%" icon={DollarSign} />
                <MetricCard title="Active Users" value="2,350" change="+180" icon={UserPlus} />
                <MetricCard title="Sales" value="+12,234" change="+19%" icon={ShoppingBag} />
                <MetricCard title="Conversion Rate" value="3.2%" change="+4.75%" icon={TrendingUp} />
            </div>

            {/* Data Table */}
            <div className="mt-8 rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-900 dark:bg-black">
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-900">
                    <div>
                        <h2 className="text-lg font-semibold">Recent Users</h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage user permissions and access status.</p>
                    </div>
                    <button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors">
                        Add User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-neutral-900 dark:text-white">{user.name}</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' :
                                            user.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' :
                                                'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default HomeAdminDashboard;