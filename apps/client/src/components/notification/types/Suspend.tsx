import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, type NotificationDTO } from "@odiano/shared"
import { TriangleAlert } from "lucide-react"
import { formatRelativeShort } from "../../../utils/dateFormater.util";
import NotificationMedia from "../NotificationMedia";
import { useSuspendedPostModal } from "../../../providers/SuspendModalProvider";

type Props = {
    item: NotificationDTO,
};

const SuspendNotification = ({ item }: Props) => {
    const suspendedPostModal = useSuspendedPostModal();
    if (item.data.type !== NOTIFICATION_TYPE.SUSPEND) return;

    const target = item.data.target;

    if (target.type === NOTIFICATION_TARGET_TYPE.POST) {
        return (
            <div className="w-full flex gap-3" onClick={() => suspendedPostModal.open(item)}>
                {/* Icon */}
                <div className="w-11 h-11 shrink-0 rounded-full bg-red-500/10 border border-red-500/30 grid place-content-center text-red-500">
                    <TriangleAlert className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold">
                                    Your post has been suspended
                                </h1>

                                <span className="text-neutral-500">
                                    {formatRelativeShort(item.createdAt)}
                                </span>
                            </div>

                            <p className="mt-0.5 text-sm text-neutral-500">
                                {target.content}
                            </p>
                        </div>

                        {/* Post thumbnail */}
                        <NotificationMedia mediaType={target.firstMedia?.type} mediaUrl={target.firstMedia?.url} mediaAspectRatio={target.firstMedia?.aspectRatio} />
                    </div>
                </div>
            </div>
        )
    }
}

export default SuspendNotification