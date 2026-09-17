import { createContext, useContext, useState } from "react";
import { USER_FOLLOW_LIST_TYPE, type UserFollowListType } from "../types/user.type";

type UserFollowListProviderType = {
    isModalOpen : boolean,
    selectedFollowListType : UserFollowListType,
    followCount : number,

    openFollowingModal: (value : number) => void,
    openFollowersModal: (value : number) => void,
    closeModal : () => void,
}

const UserFollowListContext = createContext<UserFollowListProviderType | null>(null);

export const UserFollowListProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedFollowListType, setSelectedFollowListType] = useState<UserFollowListType>(USER_FOLLOW_LIST_TYPE.FOLLOWERS)
    const [followCount, setFollowCount] = useState<number>(0);
    

    function openFollowingModal(value : number) {
        setIsModalOpen(true);
        setSelectedFollowListType(USER_FOLLOW_LIST_TYPE.FOLLOWING);
        setFollowCount(value);
    }

    function openFollowersModal(value : number) {
        setIsModalOpen(true);
        setSelectedFollowListType(USER_FOLLOW_LIST_TYPE.FOLLOWERS);
        setFollowCount(value);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <UserFollowListContext.Provider value={{
            openFollowingModal,
            openFollowersModal,
            closeModal,

            isModalOpen,
            selectedFollowListType,
            followCount,
        }}>
            {children}
        </UserFollowListContext.Provider>
    )
}

export const useUserFollowList = () => {
    const context = useContext(UserFollowListContext);

    if (!context) {
        throw new Error("useUserFollowList must be used within a UserFollowListProvider");
    }

    return context;
}