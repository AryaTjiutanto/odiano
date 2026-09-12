import type { NotificationDTO } from "@odiano/shared";
import { createContext, useContext, useState } from "react";

type SuspendModalType = {
    isOpen : boolean,
    open : (data : NotificationDTO) => void,
    close : () => void,
    data : NotificationDTO | null,
}

const SuspendModalContext = createContext<SuspendModalType | null>(null);

export const SuspendModalProvider = ({ children } : { children : React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<NotificationDTO | null>(null);

    const open = (data : NotificationDTO) => {
        setIsOpen(true);
        setData(data);
    }

    return (
        <SuspendModalContext.Provider value={{
            isOpen,
            open,    
            close: () => setIsOpen(false),
            data,
        }}>
            {children}
        </SuspendModalContext.Provider>
    )
}

export const useSuspendModal = () => {
    const context = useContext(SuspendModalContext);

    if (!context) {
        throw new Error("useNotificationModal must be used within a NotificationModalProvider");
    }

    return context;
}