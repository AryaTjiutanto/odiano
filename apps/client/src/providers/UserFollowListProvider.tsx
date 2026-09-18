import { createContext, useContext, useState } from "react";
import { USER_FOLLOW_LIST_TYPE, type UserFollowListType } from "../types/user.type";

type UserFollowListProviderType = {
    isModalOpen : boolean,
    selectedFollowListType : UserFollowListType,
    followCount : number,
    targetUserId : string | null | undefined,

    openFollowingModal: (followCount : number, targetUserId : string | null | undefined) => void,
    openFollowersModal: (followCount : number, targetUserId : string | null | undefined) => void,
    closeModal : () => void,
}

const UserFollowListContext = createContext<UserFollowListProviderType | null>(null);

export const UserFollowListProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedFollowListType, setSelectedFollowListType] = useState<UserFollowListType>(USER_FOLLOW_LIST_TYPE.FOLLOWERS)
    const [targetUserId, setTargetUserId] = useState<string | null | undefined>(null);
    const [followCount, setFollowCount] = useState<number>(0);
    
    function openModal(followCount : number, targetUserId : string | null | undefined) {
        setIsModalOpen(true);
        setFollowCount(followCount);
        setTargetUserId(targetUserId);
    }

    function openFollowingModal(followCount : number, targetUserId : string | null | undefined) {
        setSelectedFollowListType(USER_FOLLOW_LIST_TYPE.FOLLOWING);
        openModal(followCount, targetUserId);
    }

    function openFollowersModal(followCount : number, targetUserId : string | null | undefined) {
        setSelectedFollowListType(USER_FOLLOW_LIST_TYPE.FOLLOWERS);
        openModal(followCount, targetUserId);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <UserFollowListContext.Provider value={{
            openFollowingModal,
            openFollowersModal,
            closeModal,
            targetUserId,
            followCount,

            isModalOpen,
            selectedFollowListType,
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