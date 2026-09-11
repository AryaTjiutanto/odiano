import { Outlet } from "react-router-dom"
import { ResolvedReportModalProvider } from "../providers/ResolvedReportModalProvider";
import { SuspendedPostModalProvider } from "../providers/SuspendedPostModalProvider";

const NotificationModalWrapper = () => {
    return (
        <>
            <ResolvedReportModalProvider>
                <SuspendedPostModalProvider>
                    <Outlet />
                </SuspendedPostModalProvider>
            </ResolvedReportModalProvider>
        </>
    )
}

export default NotificationModalWrapper;