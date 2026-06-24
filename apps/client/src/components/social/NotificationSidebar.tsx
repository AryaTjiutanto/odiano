import { ArrowLeft } from "lucide-react";
import type React from "react";

type Props = {
    setIsNotificatoinSidebarVisible : React.Dispatch<React.SetStateAction<boolean>>
}

const NotificationSidebar = ({setIsNotificatoinSidebarVisible} : Props) => {
    return (
        <div className="w-full h-full bg-neutral-950 z-20">
            <div className="flex items-center space-x-6">
                <button className="w-8 aspect-square rounded-full grid place-content-center cursor-pointer hover:bg-sky-500/20 hover:text-sky-500 duration-100" onClick={() => setIsNotificatoinSidebarVisible(false)}>
                    <ArrowLeft className="w-5" />
                </button>
                <h1 className="font-semibold text-xl">
                    Notifications
                </h1>
            </div>
            <div className="mt-8">
                {/* like notification */}
                <article className="w-full flex items-center space-x-3">
                    <div className="h-12 aspect-square rounded-full bg-neutral-600">
                    </div>

                    <div className="flex-1 w-full flex space-x-2">
                        <p>
                            <b className="font-semibold mr-2">
                                @Test01_
                            </b>
                            Liked your post

                        </p>
                    </div>
                </article>
            </div>
        </div>
    )
}

export default NotificationSidebar;