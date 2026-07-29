import { Bell, Home, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAppSelector } from "../../hooks/useRedux"
import { useNotificationSection } from "../../providers/NotificationSectionProvider"

export const BottomNavigation = () => {
    const notificationSection = useNotificationSection();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const userData = useAppSelector(state => state.auth.user);

    const location = useLocation();

    // close notification
    const closeNotificationSection = () => {
        setTimeout(() => {
            notificationSection.close();
        }, 400)
    }

    // display
    if(!isInitialized) return null;

    if(!isAuthenticated) return null;

    return (
        <nav className="h-16 w-full bg-black sm:hidden grid grid-cols-3 z-25 fixed bottom-0 left-0 border-t border-neutral-800">
            <Link to={"/"} onClick={closeNotificationSection} className={`grid place-content-center w-full h-full group duration-100 ${location.pathname == "/" ? "text-white" : "text-neutral-400"}`}> 
                <Home/>
            </Link>
            <button className="grid place-content-center w-full h-full text-neutral-400" onClick={notificationSection.open}>
                <Bell/>
            </button>
            <Link to={`/profile/${userData?.username}`} className={`grid place-content-center w-full h-full duration-100 ${location.pathname.includes("profile") ? "text-white" : "text-neutral-400"}`} onClick={closeNotificationSection}>
                <User/>
            </Link>
        </nav>
    )
}