import { Outlet } from "react-router-dom"
import { ReportModalProvider } from "../providers/ReportModalProvider";
import { SuspendModalProvider } from "../providers/SuspendModalProvider";

const NotificationModalWrapper = () => {
    return (
        <>
            <ReportModalProvider>
                <SuspendModalProvider>
                    <Outlet />
                </SuspendModalProvider>
            </ReportModalProvider>
        </>
    )
}

export default NotificationModalWrapper;