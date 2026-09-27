import { X } from "lucide-react"
import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, REPORT_STATUS } from "@odiano/shared";
import { toHumanReadableDate } from "../../utils/dateFormater.util";
import ModalPostCard from "./PostCard";
import { useReportModal } from "../../providers/ReportModalProvider";
import ModalContainer from "./ModalContainer";

const ReportModal = () => {
    const reportModal = useReportModal();
    const notificationData = reportModal.data;

    if (!notificationData || notificationData.data.type !== NOTIFICATION_TYPE.REPORT) return <></>

    if (notificationData.data.status == REPORT_STATUS.RESOLVED) {
        return (
            <ModalContainer closeModalHandler={reportModal.close}>
                <div className="sm:w-[550px] p-16">
                    <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-4 left-4" onClick={() => reportModal.close()}>
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
                                    #{notificationData?.data.report.reason ?? "-"}
                                </h2>
                            </div>
                            <h1 className="font-bold text-neutral-300 text-2xl">
                                Your report has been resolved
                            </h1>
                        </div>
                        {
                            notificationData?.data.target.type == NOTIFICATION_TARGET_TYPE.POST &&
                            <ModalPostCard data={notificationData.data.target} />
                        }
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
            </ModalContainer>
        )
    }
}

export default ReportModal;