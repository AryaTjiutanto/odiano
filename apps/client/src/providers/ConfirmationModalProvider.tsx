import { createContext, useContext, useRef, useState } from "react";

type ConfirmationModalContextType = {
    setIsOpen : React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean,
    title : string,
    description : string,
    confirm : (title : string, description : string, confirmButtonText : string, cancelButtonText : string) => Promise<boolean>,
    handleConfirm : () => void,
    handleCancel : () => void,
    cancelButtonText : string,    
    confirmButtonText : string,
}

const ConfirmationModalContext = createContext<ConfirmationModalContextType | null>(null);

export const ConfirmationModalProvider = ({ children }: React.PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [confirmButtonText, setConfirmButtonText] = useState<string>("");
    const [cancelButtonText, setCancelButtonText] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const resolveRef = useRef<((result : boolean) => void) | null>(null);

    const confirm = (title : string, description : string, confirmButtonText : string = "Confirm", cancelButtonText : string = "Cancel") => {
        setTitle(title);
        setDescription(description);
        setIsOpen(true);
        setConfirmButtonText(confirmButtonText);        
        setCancelButtonText(cancelButtonText);
        
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }

    const handleConfirm = () => {
        resolveRef.current?.(true);
        resolveRef.current = null;
        setIsOpen(false);
    }
    
    const handleCancel = () => {
        resolveRef.current?.(false);
        resolveRef.current = null;
        setIsOpen(false);
    }

    return (
        <ConfirmationModalContext.Provider value={{
            isOpen,
            setIsOpen,
            title,
            description,
            confirm,
            handleConfirm,
            handleCancel,
            confirmButtonText,
            cancelButtonText,
        }}>
            {children}
        </ConfirmationModalContext.Provider>
    )
}       

export const useConfirmationModal = () => {
    const context = useContext(ConfirmationModalContext);

    if(!context) {
        throw new Error("useConfirmationModal must be used within ConfirmationModalProvider");
    }

    return context;
};