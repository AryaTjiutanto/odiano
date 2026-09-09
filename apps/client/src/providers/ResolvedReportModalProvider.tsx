import type { NotificationDTO } from "@odiano/shared";
import { createContext, useContext, useState } from "react";

type ResolvedReportModalType = {
    isOpen : boolean,
    open : (data : NotificationDTO) => void,
    close : () => void,
    data : NotificationDTO | null,
}

const ResolvedReportModal = createContext<ResolvedReportModalType | null>(null);

export const ResolvedReportModalProvider = ({ children } : { children : React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<NotificationDTO | null>(null);

    const open = (data : NotificationDTO) => {
        setIsOpen(true);
        setData(data);
    }

    return (
        <ResolvedReportModal.Provider value={{
            isOpen,
            open,    
            close: () => setIsOpen(false),
            data,
        }}>
            {children}
        </ResolvedReportModal.Provider>
    )
}

export const useResolvedReportModal = () => {
    const context = useContext(ResolvedReportModal);

    if (!context) {
        throw new Error("useNotificationModal must be used within a NotificationModalProvider");
    }

    return context;
}