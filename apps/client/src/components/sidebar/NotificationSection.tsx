import { ArrowLeft, X } from "lucide-react";
import Notifications from "../notification/Notifications";
import { useNotificationSection } from "../../providers/NotificationSectionProvider";

type Props = {
    hasCloseButton? : boolean,
}

const NotificationSection = ({ hasCloseButton = true }: Props) => {
    const notificationSection = useNotificationSection();

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center space-x-6 px-5 sm:px-0 pt-5 sm:pt-0 xl:pt-4">
                {hasCloseButton &&
                    <button className="w-8 aspect-square rounded-full grid place-content-center cursor-pointer hover:bg-sky-500/20 hover:text-sky-500 duration-100" onClick={notificationSection.close}>
                        <ArrowLeft className="w-5 hidden 2xl:flex" />
                        <X className="w-5 2xl:hidden"/>
                    </button>
                }
                <h1 className="font-bold sm:font-semibold text-2xl sm:text-xl">
                    Notifications
                </h1>
            </div>
            <div className="px-2 sm:px-0 mt-5 xl:mt-8 w-full overflow-y-auto flex-1">
                <Notifications/>
            </div>
        </div>
    )
}

export default NotificationSection;