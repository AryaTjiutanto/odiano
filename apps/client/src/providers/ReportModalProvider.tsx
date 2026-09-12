import type { NotificationDTO } from "@odiano/shared";
import { createContext, useContext, useState } from "react";

type ReportModalType = {
    isOpen : boolean,
    open : (data : NotificationDTO) => void,
    close : () => void,
    data : NotificationDTO | null,
}

const ReportModalContext = createContext<ReportModalType | null>(null);

export const ReportModalProvider = ({ children } : { children : React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<NotificationDTO | null>(null);

    const open = (data : NotificationDTO) => {
        setIsOpen(true);
        setData(data);
    }

    return (
        <ReportModalContext.Provider value={{
            isOpen,
            open,    
            close: () => setIsOpen(false),
            data,
        }}>
            {children}
        </ReportModalContext.Provider>
    )
}

export const useReportModal = () => {
    const context = useContext(ReportModalContext);

    if (!context) {
        throw new Error("useNotificationModal must be used within a NotificationModalProvider");
    }

    return context;
}