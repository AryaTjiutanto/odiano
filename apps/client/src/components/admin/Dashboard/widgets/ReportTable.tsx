import { REPORT_STATUS, type ReportStatus } from "@odiano/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { reportKeys } from "../../../../queries/reportKeys";
import { getReportList } from "../../../../services/report.service";
import { DEFAULT_GC_TIME } from "../../../../consts/queryTime.const";

const ReportTable = () => {
    const [activeTab, setActiveTab] = useState<ReportStatus>(REPORT_STATUS.PENDING);

    const reportQuery = useQuery({
        queryKey : reportKeys.list(activeTab),
        queryFn : () => getReportList(activeTab),
        staleTime : 30 * 1000,
        gcTime : DEFAULT_GC_TIME,
    })

    return (
        <section className="">
            <div>
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Review reported content and manage reports based on their current status.
                </p>
            </div>
            <div className="w-full border-b border-neutral-800 mt-3">
                {
                    Object.values(REPORT_STATUS).map((status) => {
                        return (
                            <button
                                key={status}
                                onClick={() => setActiveTab(status)}
                                className={`px-4 pt-2 pb-3 cursor-pointer duration-100 border-b-2 ${activeTab === status ? 'border-neutral-100 text-neutral-100 font-medium' : 'border-transparent text-neutral-400 first:pl-0'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>
                                        {status}
                                    </span>
                                </div>
                            </button>
                        )
                })
            }
            </div>
            <div className="mt-4 rounded-xl border shadow-sm border-neutral-800 bg-black">
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-900">
                    <div>
                        <h2 className="text-lg font-semibold">Pending Reports</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-neutral-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Target</th>
                                <th className="px-6 py-4 font-medium">Reason</th>
                                <th className="px-6 py-4 font-medium">Reporter</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Created At</th>
                                <th className="w-[10%] px-6 py-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {/* {mockUsers.map((user) => (
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
                            ))} */}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default ReportTable;