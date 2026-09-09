import type { NotificationDTO } from "@odiano/shared";
import { createContext, useContext, useState } from "react";

type SuspendedPostModalType = {
    isOpen : boolean,
    open : (data : NotificationDTO) => void,
    close : () => void,
    data : NotificationDTO | null,
}

const SuspendedPostModal = createContext<SuspendedPostModalType | null>(null);

export const SuspendedPostModalProvider = ({ children } : { children : React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<NotificationDTO | null>(null);

    const open = (data : NotificationDTO) => {
        setIsOpen(true);
        setData(data);
    }

    return (
        <SuspendedPostModal.Provider value={{
            isOpen,
            open,    
            close: () => setIsOpen(false),
            data,
        }}>
            {children}
        </SuspendedPostModal.Provider>
    )
}

export const useSuspendedPostModal = () => {
    const context = useContext(SuspendedPostModal);

    if (!context) {
        throw new Error("useNotificationModal must be used within a NotificationModalProvider");
    }

    return context;
}