import { createContext, useContext, useState } from "react";

type UserFollowersModalProviderType = {
    isOpen: boolean,
    open: () => void,
    close: () => void,
}

const UserFollowersModalContext = createContext<UserFollowersModalProviderType | null>(null);

export const UserFollowersModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    function open() {
        setIsOpen(true);
    }

    function close() {
        setIsOpen(false);
    }

    return (
        <UserFollowersModalContext.Provider value={{
            isOpen,
            open,
            close
        }}>
            {children}
        </UserFollowersModalContext.Provider>
    )
}

export const useUserFollowersModal = () => {
    const context = useContext(UserFollowersModalContext);

    if (!context) {
        throw new Error("useUserFollowersModal must be used within a UserFollowersModalProvider");
    }

    return context;
}