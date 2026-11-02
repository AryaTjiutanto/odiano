import type { SessionDTO } from "@odiano/shared"
import { Globe } from "lucide-react"
import { getSessionDevice } from "../../utils/userAgent.util"
import { formatDistanceToNow } from "date-fns"

type Props = {
    session: SessionDTO | undefined | null,
    withLogoutButton?: boolean,
    withDate?: boolean,
    isActive?: boolean
}

const Session = ({ session, withLogoutButton = true, withDate = true, isActive = true }: Props) => {
    if (!session?.device.userAgent) return (
        <div></div>
    )

    const device = getSessionDevice(session.device.userAgent);
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 grid place-content-center rounded-full bg-neutral-950 border border-neutral-600">
                    <Globe className="w-6" />
                </div>
                <div className="space-y-1">
                    <h1 className="font-medium">{device.browser} ({device.os})</h1>
                    {
                        withDate ?
                            <div className="text-neutral-400 text-xs">
                                {session.lastActive ? formatDistanceToNow(new Date(session.lastActive)) : "-"}
                            </div>
                            :
                            isActive ?
                                <div className="text-sky-500 text-xs">
                                    Active now
                                </div>
                                :
                                <div className="text-red-500 text-xs">
                                    Unactive
                                </div>
                    }
                </div>
            </div>
            {
                withLogoutButton &&
                <button className="text-xs w-20 h-9 bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white duration-100 cursor-pointer rounded-full">
                    Log out
                </button>
            }
        </div>
    )
}

export default Session;