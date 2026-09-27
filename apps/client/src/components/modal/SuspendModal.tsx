import { X } from "lucide-react"
import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "@odiano/shared";
import { toHumanReadableDate } from "../../utils/dateFormater.util";
import ModalPostCard from "./PostCard";
import { useSuspendModal } from "../../providers/SuspendModalProvider";
import ModalContainer from "./ModalContainer";

const SuspendModal = () => {
    const suspendModal = useSuspendModal();
    const notificationData = suspendModal.data;

    if (!notificationData || notificationData.data.type !== NOTIFICATION_TYPE.SUSPEND) return <></>;

    if (notificationData.data.target.type === NOTIFICATION_TARGET_TYPE.POST) {
        return (
            <ModalContainer closeModalHandler={suspendModal.close}>
                <div className="sm:w-[550px] relative p-14 md:p-16">
                    <button className="w-10 h-10 rounded-full bg-transparent hover:bg-neutral-800/80 duration-100 cursor-pointer grid place-content-center absolute top-4 left-4" onClick={() => suspendModal.close()}>
                        <X className="w-5" />
                    </button>
                    <div>
                        <div className="">
                            <div className="flex items-center space-x-2">
                                <h2 className="font-bold text-neutral-500">
                                    {notificationData?.createdAt
                                        ? toHumanReadableDate(notificationData.createdAt) : "-"}
                                </h2>
                            </div>
                            <h1 className="font-bold text-neutral-300 text-2xl">
                                Your Post has been suspended
                            </h1>
                        </div>
                        {
                            notificationData?.data.target.type == NOTIFICATION_TARGET_TYPE.POST &&
                            <ModalPostCard data={notificationData.data.target} />
                        }
                        <div className="mt-4 text-neutral-400 text-sm space-y-5">
                            <p>
                                Your post has been suspended because it was found to violate our
                                community guidelines.
                            </p>
                            <div>
                                <h1 className="text-xl font-bold text-neutral-100">
                                    Actions taken:
                                </h1>

                                <p className="mt-2">
                                    We have suspended your post from being visible to other users.
                                    Please review our community guidelines to help ensure that
                                    future posts follow our rules.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalContainer>
        )
    }
}

export default SuspendModal;