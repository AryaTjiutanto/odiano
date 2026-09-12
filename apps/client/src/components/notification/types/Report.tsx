import { NOTIFICATION_TYPE, REPORT_STATUS, type NotificationDTO } from "@odiano/shared"
import { formatRelativeShort } from "../../../utils/dateFormater.util";
import { BadgeInfo } from "lucide-react";
import { useReportModal } from "../../../providers/ReportModalProvider";

type Props = {
    item : NotificationDTO,
};

const ReportNotification = ({ item } : Props) => {
    const reportModal = useReportModal();
    if(item.data.type !== NOTIFICATION_TYPE.REPORT) return;


    const report = item.data.report;

    if(item.data.status == REPORT_STATUS.RESOLVED) {
        return (
            <div className="w-full flex gap-3" onClick={() => {reportModal.open(item)}}>
                {/* Icon */}
                <div className="w-11 h-11 shrink-0 rounded-full bg-sky-500/10 border border-sky-500/30 grid place-content-center text-sky-500">
                    <BadgeInfo className="w-5 h-5"/>
                </div>
    
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">
                                    Your report has been resolved
                                </h1>
    
                                <span className="text-neutral-500">
                                    {formatRelativeShort(item.createdAt)}
                                </span>
                            </div>
    
                            <p className="mt-0.5 text-sm text-neutral-500">
                                Post you reported for <b className="font-semibold text-neutral-400">#{report.reason}</b>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReportNotification