import { X } from "lucide-react"
import { useResolvedReportModal } from "../../providers/ResolvedReportModalProvider"
import { NOTIFICATION_TYPE } from "@odiano/shared";
import NotificationMedia from "../notification/NotificationMedia";
import { toHumanReadableDate } from "../../utils/dateFormater.util";
import Profile from "../profile/Profile";

const ResolvedReportModal = () => {
    const resolvedReportModal = useResolvedReportModal();
    const notificationData = resolvedReportModal.data;
    
    if (!notificationData || notificationData.data.type !== NOTIFICATION_TYPE.YOUR_REPORT_RESOLVED) return <></>;
    
    const target = notificationData?.data.target;

    return (
        <section className="w-full h-full fixed top-0 left-0 z-26 flex items-center justify-center">
            <div className="bg-[#101010] w-[550px] rounded-2xl p-16 relative z-27">
                <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-4 left-4" onClick={() => resolvedReportModal.close()}>
                    <X className="w-5" />
                </button>
                <div>
                    <div className="">
                        <div className="flex items-center space-x-2">
                            <h2 className="font-bold text-neutral-500">
                                {notificationData?.createdAt
                                    ? toHumanReadableDate(notificationData.createdAt) : "-"}
                            </h2>
                            <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
                            <h2 className="font-bold text-neutral-500">
                                #{notificationData?.data.report.code ?? "-"}
                            </h2>
                        </div>
                        <h1 className="font-bold text-neutral-300 text-2xl">
                            Your report has been resolved
                        </h1>
                    </div>
                    <div className="mt-4 border rounded-xl border-neutral-600 p-3">
                        <div className="flex space-x-3">
                            <div className="w-12 h-12 rounded-full bg-neutral-800">
                                <Profile data={target.author?.profileImage}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h1 className="font-semibold text-neutral-300">
                                                {target.author?.name ?? "-"}
                                            </h1>
                                            <h2 className="text-neutral-500">
                                                @{target.author?.username ?? "-"}
                                            </h2>
                                        </div>
                                        <div className="text-sm text-neutral-500">
                                            {target.createdAt ? toHumanReadableDate(target.createdAt) : "-"}
                                        </div>
                                    </div>
                                    <div className="rounded-md bg-neutral-800">
                                        <NotificationMedia mediaType={target.firstMedia?.type} mediaUrl={target.firstMedia?.url} mediaAspectRatio={target.firstMedia?.aspectRatio} />
                                    </div>
                                </div>
                                <p className="mt-1 text-sm text-neutral-400 truncate">
                                    {target.content || ""}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-neutral-400 text-sm space-y-5">
                        <p>
                            Thank you for taking the time to report content that you believe violates our community guidelines. Your reports help us keep the platform safe and enjoyable for everyone.
                        </p>

                        <div>
                            <h1 className="text-xl font-bold text-neutral-100">
                                Actions taken:
                            </h1>
                            <p className="mt-2">
                                We determined that the reported content violated our community guidelines and have taken appropriate action against it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-full fixed bg-black/50 top-0 left-0 z-26" onClick={() => resolvedReportModal.close()}></div>
        </section>
    )
}

export default ResolvedReportModal