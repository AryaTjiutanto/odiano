import type { SessionDTO, SessionsDTO } from "@odiano/shared"
import { Globe } from "lucide-react"
import { getSessionDevice } from "../../utils/userAgent.util"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { deleteSession } from "../../services/session.service"
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler"
import { sessionKeys } from "../../queries/sessionKeys"
import DotsLoader from "../loader/DotsLoader"
import { notify } from "../../helpers/notification/notify.helper"
import { useConfirmationModal } from "../../providers/ConfirmationModalProvider"

type Props = {
    session: SessionDTO | undefined | null,
    withLogoutButton?: boolean,
    withDate?: boolean,
    isActive?: boolean
}

const Session = ({ session, withLogoutButton = true, withDate = true, isActive = true }: Props) => {
    const confirmationModal = useConfirmationModal();

    const setQueryDataHandler = useSetQueryDataHandler();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!session?.device.userAgent) return (
        <div></div>
    )

    const device = getSessionDevice(session.device.userAgent);

    async function logoutHandler(sessionId: string) {
        const confirmation = await confirmationModal.confirm(
            "Log Out This Session?",
            `You’ll be signed out of ${device.browser} (${device.os}) and will need to sign in again to access your account.`,
            "Log Out",
            "Cancel"
        );

        if (!confirmation) {
            return;
        }

        if (!session?.id || isLoading) return;
        setIsLoading(true);

        await deleteSession(sessionId);

        notify.success({
            title: "Session logged out",
            description: `${device.browser} (${device.os}) has been logged out successfully.`,
        });

        setQueryDataHandler<SessionsDTO>(sessionKeys.all, (oldData) => {
            return {
                ...oldData,
                otherSessions: oldData.otherSessions.filter(session => session.id !== sessionId)
            }
        })

        setIsLoading(false);
    }

    return (
        <div className="flex items-center justify-between" key={`session-${session.id}`}>
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 grid place-content-center rounded-full bg-neutral-950 border border-neutral-600">
                    <Globe className="w-6" />
                </div>
                <div className="space-y-1">
                    <h1 className="font-medium">{device.browser} ({device.os})</h1>
                    {
                        withDate ?
                            <div className="text-neutral-400 text-xs">
                                {session.lastLogin ? formatDistanceToNow(new Date(session.lastLogin)) : "-"}
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
                <button className={`text-xs w-20 h-9 duration-100 cursor-pointer rounded-full grid place-content-center ${isLoading ? "bg-white text-black" : "bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"}`} disabled={isLoading} onClick={() => logoutHandler(session.id)}>
                    {
                        isLoading ?
                            <DotsLoader size="small" />
                            :
                            "Log out"
                    }
                </button>
            }
        </div>
    )
}

export default Session;