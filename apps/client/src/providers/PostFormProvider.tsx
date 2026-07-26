import { createContext, useContext, useState } from "react";

type PostFormContextType = {
    isOpen: boolean,
    open: () => void,
    close: () => void,
}

const PostFormContext = createContext<PostFormContextType | null>(null);


type Props = {
    children: React.ReactNode
}

export function PostFormProvider({ children }: Props) {
    const [isOpen,setIsOpen ] = useState<boolean>(false);

    return (
        <PostFormContext.Provider value={{
            isOpen,
            open: () => setIsOpen(true),
            close : () => setIsOpen(false),
        }}>
            {children}
        </PostFormContext.Provider>
    )
}

export function usePostForm () {
    const context = useContext(PostFormContext);

    if(!context) {
        throw new Error("Something went wrong");
    }

    return context;
}