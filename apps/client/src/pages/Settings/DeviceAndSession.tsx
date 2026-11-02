import { useQuery } from "@tanstack/react-query";
import { sessionKeys } from "../../queries/sessionKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { getSessions } from "../../services/session.service";
import type { SessionsDTO } from "@odiano/shared";
import SessionSkelatonLoading from "../../components/session/SessionSkelatonLoading";
import Session from "../../components/session/Session";

const DeviceAndSessions = () => {
    const sessionData = useQuery<SessionsDTO>({
        queryFn: getSessions,
        queryKey: sessionKeys.all,
        staleTime: 1 * 60 * 1000,
        gcTime: DEFAULT_GC_TIME,
    });

    return (
        <div>
            <h1 className="font-semibold text-xl">
                Devices and Sessions
            </h1>
            <div className="mt-3">
                <p className="text-sm text-neutral-400">
                    Sessions are the devices you are using or that have used your Odiano account. These are the sessions where your account is currently logged in. You can log out of each session.
                </p>
            </div>
            <div className="mt-10">
                <h2 className="text-base font-semibold">
                    Current active sessions
                </h2>
                <div className="mt-3">
                    {
                        (sessionData.isFetching) ?
                            <SessionSkelatonLoading />
                            :
                            <Session session={sessionData.data?.currentSession} withLogoutButton={false} withDate={false}/>
                    }
                </div>
            </div>
            <div className="mt-10">
                <div>
                    <h2 className="text-base font-semibold">
                        Log out of other sessions
                    </h2>
                    <p className="text-sm mt-3 text-neutral-500">
                        You’re logged into these accounts on these devices and aren’t currently using them.
                    </p>
                </div>
                <div className="mt-5 space-y-4">
                    {
                        (sessionData.isFetching) ?
                            Array.from({ length: 3 }).map(() => (
                                <SessionSkelatonLoading />
                            ))
                            :
                            sessionData.data?.otherSessions.map((session) => (
                                <Session session={session}/>
                            ))
                    }
                </div>
            </div>
        </div>
    )
}

export default DeviceAndSessions;