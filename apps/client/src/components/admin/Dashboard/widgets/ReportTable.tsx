import { MEDIA_ASPECT_RATIO, REPORT_STATUS, REPORT_TYPE, type PaginationData, type ReportDTO, type ReportStatus } from "@odiano/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { reportKeys } from "../../../../queries/reportKeys";
import { getReportList, processReport, takeAction } from "../../../../services/report.service";
import { DEFAULT_GC_TIME } from "../../../../consts/queryTime.const";
import Profile from "../../../profile/Profile";
import { formatDistance } from "date-fns";
import { StickyNote } from "lucide-react";
import DotsLoader from "../../../loader/DotsLoader";
import { notify } from "../../../../helpers/notification/notify.helper";
import { Link } from "react-router-dom";

type ProccessReportMutationData = {
    pendingReportsPrevData: ReportDTO[] | undefined,
    reviewedReportsPrevData: ReportDTO[] | undefined,
    pendingReportsPaginationPrevData: PaginationData | undefined,
    reviewedReportsPaginationPrevData: PaginationData | undefined,
}

const ReportTable = () => {
    const setQueryClient = useQueryClient();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<ReportStatus>(REPORT_STATUS.PENDING);

    // report query
    async function reportQueryFn(): Promise<ReportDTO[]> {
        const cachedPagination = queryClient.getQueryData<PaginationData | undefined>(reportKeys.pagination(activeTab));

        const data = await getReportList({
            status: activeTab,
            page: 1,
            withPagination: !cachedPagination,
        });

        if (data.pagination) {
            queryClient.setQueryData(reportKeys.pagination(activeTab), data.pagination);
        }

        return data.data;
    }

    const reportQuery = useQuery({
        queryKey: reportKeys.list(activeTab),
        queryFn: reportQueryFn,
        staleTime: 60 * 1000,
        gcTime: DEFAULT_GC_TIME,
    })

    // pagination query
    const reportPaginationQuery = useQuery<PaginationData | undefined>({
        queryKey: reportKeys.list(activeTab),
        queryFn: () => {
            return queryClient.getQueryData(reportKeys.pagination(activeTab));
        },
        staleTime: 60 * 1000,
        gcTime: DEFAULT_GC_TIME,
    });

    // mutation contructor
    const updateReportStatusMutation = (currentStatus : ReportStatus, targetStatus : ReportStatus, mutationFn : (report : string) => Promise<boolean>) => useMutation<boolean, Error, ReportDTO, ProccessReportMutationData>({
        mutationFn: (report) => mutationFn(report.id),
        onMutate: (report) => {
            let pendingReportsPrevData;
            let reviewedReportsPrevData;
            let pendingReportsPaginationPrevData;
            let reviewedReportsPaginationPrevData;

            // update current report
            setQueryClient.setQueryData<ReportDTO[]>(reportKeys.list(currentStatus), (oldData) => {
                pendingReportsPrevData = oldData;
                return oldData?.filter(oldReport => oldReport.id !== report.id);
            });

            // update current pagination
            setQueryClient.setQueryData<PaginationData | undefined>(reportKeys.pagination(currentStatus), (oldData) => {
                pendingReportsPaginationPrevData = oldData;
                if (!oldData) return;
                return oldData?.totalItem > 0 ? {
                    ...oldData,
                    totalItem: oldData.totalItem - 1,
                } : undefined;
            });

            // update target report
            setQueryClient.setQueryData<ReportDTO[]>(reportKeys.list(targetStatus), (oldData) => {
                reviewedReportsPrevData = oldData;
                return [...(oldData || []), {
                    ...report,
                    status: targetStatus,
                }];
            });

            // update target pagination
            setQueryClient.setQueryData<PaginationData | undefined>(reportKeys.pagination(targetStatus), (oldData) => {
                pendingReportsPaginationPrevData = oldData;
                if (!oldData) return;

                return oldData?.totalItem > 0 ? {
                    ...oldData,
                    totalItem: oldData.totalItem + 1,
                } : undefined;
            });

            return {
                pendingReportsPrevData,
                reviewedReportsPrevData,
                pendingReportsPaginationPrevData,
                reviewedReportsPaginationPrevData,
            }
        },
        onError: (_error, _variable, context) => {
            // reset current report
            setQueryClient.setQueryData<ReportDTO[]>(reportKeys.list(currentStatus), () => context?.pendingReportsPrevData);

            // reset current pagination
            setQueryClient.setQueryData<PaginationData | undefined>(reportKeys.pagination(currentStatus), () => context?.pendingReportsPaginationPrevData);

            // reset target report
            setQueryClient.setQueryData<ReportDTO[]>(reportKeys.list(targetStatus), () => context?.reviewedReportsPrevData);

            // reset target pagination
            setQueryClient.setQueryData<PaginationData | undefined>(reportKeys.pagination(targetStatus), () => context?.reviewedReportsPaginationPrevData);
        },
    })

    // process report
    const processMutation = updateReportStatusMutation(REPORT_STATUS.PENDING, REPORT_STATUS.REVIEWING, processReport);

    const processReportHandler = async (report: ReportDTO) => {
        try {
            await processMutation.mutateAsync(report);
        } catch {
            notify.error({ title: "Error", description: "Failed to process report" });
        }
    }

    // delete content
    const takeActionMutation = updateReportStatusMutation(REPORT_STATUS.REVIEWING, REPORT_STATUS.RESOLVED, takeAction);

    const takeActionHandler = async (report: ReportDTO) => {
        try {
            await takeActionMutation.mutateAsync(report);
        } catch {
            notify.error({ title: "Error", description: "Failed to delete content" });
        }
    }

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

                {
                    reportQuery.isPending &&
                    <div>
                        <div className="h-76 flex items-center justify-center w-full">
                            <DotsLoader />
                        </div>
                    </div>
                }
                {
                    (reportQuery.data && !reportQuery.isPending) &&
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-neutral-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Reporter</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Reason</th>
                                    <th className="px-6 py-4 font-medium">Target</th>
                                    <th className="px-6 py-4 font-medium">Created At</th>
                                    <th className="w-[10%] px-6 py-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {reportQuery.data && reportQuery.data.map((report) => (
                                    <tr key={`report-${report.id}`} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-10 h-10">
                                                    <Profile data={report.reporter.profileImage} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-white">{report.reporter.name}</div>
                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">@{report.reporter.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                                            {
                                                report.target.type == REPORT_TYPE.POST &&
                                                <div className="w-[60%] flex px-3 py-2 rounded-lg bg-sky-500/20 border border-sky-500 space-x-2 items-center text-neutral-100">
                                                    <StickyNote className="w-5" />
                                                    <span>
                                                        Post
                                                    </span>
                                                </div>
                                            }
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-neutral-100">
                                            {report.reason}
                                        </td>
                                        <td className="px-6 py-4">
                                            {
                                                report.target.type == REPORT_TYPE.USER &&
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-10 h-10">
                                                        <Profile data={report.target.snapshot.profileImage} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-neutral-900 dark:text-white">{report.target.snapshot.name}</div>
                                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">@{report.target.snapshot.username}</div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                report.target.type == REPORT_TYPE.POST &&
                                                <Link to={`/author/post/${report.target.snapshot.publicId}`} className="hover:text-neutral-400" target="_blank">
                                                    <div className="flex items-center space-x-2 cursor-pointer">
                                                        {
                                                            report.target.snapshot.content &&
                                                            <div className="flex-1 truncate">
                                                                {report.target.snapshot.content}
                                                            </div>
                                                        }
                                                        {
                                                            (report.target.snapshot.media && report.target.snapshot.media.length > 0) &&
                                                            <img className="max-h-10 rounded-lg" src={report.target.snapshot.media[0].source.url} style={{ ...(report.target.snapshot.media[0].aspectRatio !== MEDIA_ASPECT_RATIO.original && { aspectRatio: report.target.snapshot.media[0].aspectRatio }) }} />
                                                        }
                                                    </div>
                                                </Link>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDistance(new Date(report.createdAt), new Date(), {
                                                addSuffix: true,
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {
                                                report.status == REPORT_STATUS.PENDING &&
                                                <button className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 cursor-pointer" onClick={() => processReportHandler(report)}>
                                                    Process
                                                </button>
                                            }
                                            {
                                                report.status == REPORT_STATUS.REVIEWING &&
                                                <button className="font-medium text-red-500 hover:text-red-700 cursor-pointer" onClick={() => takeActionHandler(report)}>
                                                    Take Action
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                {
                    (!reportQuery.data && !reportQuery.isPending) &&
                    <div className="h-76 flex items-center justify-center w-full">
                        <div className="text-center text-neutral-500 dark:text-neutral-400">
                            No report found
                        </div>
                    </div>
                }
            </div>
        </section>
    )
}

export default ReportTable;