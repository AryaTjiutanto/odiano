import { Outlet } from "react-router-dom";
import { NotificationSectionProvider } from "../providers/NotificationSectionProvider";

const NotificationSectionLayout = () => {
    return (
        <NotificationSectionProvider>
            <Outlet/>
        </NotificationSectionProvider>
    )
}

export default NotificationSectionLayout;