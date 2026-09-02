import ReportTable from "../../../components/admin/Dashboard/widgets/ReportTable";

// --- Types ---
// interface MetricCardProps {
//     title: string;
//     value: string;
//     change: string;
//     icon: React.ElementType;
// }
// --- Helper Components ---
// const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon }) => (
//     <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-900 dark:bg-black">
//         <div className="flex items-center justify-between">
//             <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</span>
//             <div className="rounded-lg bg-sky-50 p-2 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
//                 <Icon className="h-5 w-5" />
//             </div>
//         </div>
//         <div className="mt-4 flex items-baseline justify-between">
//             <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">{value}</h3>
//             <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
//                 {change}
//                 <ArrowUpRight className="ml-0.5 h-3 w-3" />
//             </span>
//         </div>
//     </div>
// );

// --- Main Admin Panel ---
const HomeAdminDashboard = () => {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Overview</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Welcome back. Here is what is happening today.</p>
            </div>

            {/* Metrics Grid */}
            {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Revenue" value="$45,231.89" change="+20.1%" icon={DollarSign} />
                <MetricCard title="Active Users" value="2,350" change="+180" icon={UserPlus} />
                <MetricCard title="Sales" value="+12,234" change="+19%" icon={ShoppingBag} />
                <MetricCard title="Conversion Rate" value="3.2%" change="+4.75%" icon={TrendingUp} />
            </div> */}

            {/* Report Table */}
            <ReportTable/>
        </>
    );
}

export default HomeAdminDashboard;