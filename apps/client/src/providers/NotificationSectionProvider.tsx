import React, { createContext, useContext, useState } from "react";

type NotificationContextType = {
    isOpen: boolean,
    open: () => void,
    close: () => void,
    toggle: () => void,
}

const NotificationSectionContext = createContext<NotificationContextType | null>(null);

type Props = {
    children: React.ReactNode
}

export const NotificationSectionProvider = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <NotificationSectionContext.Provider value={{
            isOpen,
            open : () => setIsOpen(true),
            close : () => setIsOpen(false),
            toggle : () => setIsOpen(!isOpen)
        }}>
            {children}
        </NotificationSectionContext.Provider>
    )
}

export const useNotificationSection = () => {
    const context = useContext(NotificationSectionContext);

    if(!context) {
        throw new Error("Something went wrong");
    }

    return context;
}