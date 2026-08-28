import { createContext, useContext, useState } from "react";

type DashboardContextType = {
    setIsSidebarOpen: (isOpen: boolean) => void;
    isSidebarOpen: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const value = {
        setIsSidebarOpen,
        isSidebarOpen,
    }

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    )
}

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === null) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}