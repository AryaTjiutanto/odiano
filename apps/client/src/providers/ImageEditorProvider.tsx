import React, { createContext, useContext, useRef, useState } from "react";
import type { FileEditData, FileEditResult, ImageEditorOptions } from "../types/file.type";
import { MEDIA_ASPECT_RATIO } from "@odiano/shared";

type ImageEditorContextType = {
    edit: (blob: Blob, editData: FileEditData | undefined, options: ImageEditorOptions) => Promise<FileEditResult | null>,
    isOpen: boolean,
    imageBlob: Blob | null,
    editData: FileEditData | undefined,
    options: ImageEditorOptions,
    handleComplete: (result: FileEditResult | null) => void,
    close: () => void,
}

const ImageEditorContext = createContext<ImageEditorContextType | null>(null);

export const ImageEditorProvider = ({ children }: React.PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [editData, setEditData] = useState<FileEditData | undefined>(undefined);
    const [options, setOptions] = useState<ImageEditorOptions>({
        aspectRatio: MEDIA_ASPECT_RATIO["1:1"],
        allowAspectRatioChange: false,
    });

    const editResultRef = useRef<((resut: FileEditResult | null) => void) | null>(null);

    const edit = (blob: Blob, editData: FileEditData | undefined, options: ImageEditorOptions) => {
        setIsOpen(true);
        setImageBlob(blob);
        setEditData(editData);
        setOptions(options);

        return new Promise<FileEditResult | null>((resolve) => {
            editResultRef.current = resolve;
        });
    }

    const handleComplete = (result: FileEditResult | null) => {
        setIsOpen(false);
        setImageBlob(null);
        setEditData(undefined);

        if (editResultRef.current) {
            editResultRef.current(result);
        }
    }

    const close = () => {
        setIsOpen(false);
        setImageBlob(null);
        setEditData(undefined);

        if (editResultRef.current) {
            editResultRef.current(null);
        }
    }

    return (
        <ImageEditorContext.Provider value={{
            edit,
            isOpen,
            imageBlob,
            editData,
            options,
            handleComplete,
            close,
        }}>
            {children}
        </ImageEditorContext.Provider>
    )
}

export const useImageEditor = () => {
    const context = useContext(ImageEditorContext);

    if (!context) {
        throw new Error("useImageEditor must be used within ImageEditorProvider");
    }

    return context;
}