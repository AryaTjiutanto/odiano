import { Outlet } from "react-router-dom"
import { ResolvedReportModalProvider } from "../providers/ResolvedReportModalProvider";

const NotificationModalWrapper = () => {
    return (
        <>
            <ResolvedReportModalProvider>
                <Outlet />
            </ResolvedReportModalProvider>
        </>
    )
}

export default NotificationModalWrapper;