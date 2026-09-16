import { createContext, useContext, useState } from "react";

type UserFollowingModalProviderType = {
    isOpen: boolean,
    open: () => void,
    close: () => void,
}

const UserFollowingModalContext = createContext<UserFollowingModalProviderType | null>(null);

export const UserFollowingModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    function open() {
        setIsOpen(true);
    }

    function close() {
        setIsOpen(false);
    }

    return (
        <UserFollowingModalContext.Provider value={{
            isOpen,
            open,
            close
        }}>
            {children}
        </UserFollowingModalContext.Provider>
    )
}

export const useUserFollowingModal = () => {
    const context = useContext(UserFollowingModalContext);

    if (!context) {
        throw new Error("useUserFollowingModal must be used within a UserFollowingModalProvider");
    }

    return context;
}