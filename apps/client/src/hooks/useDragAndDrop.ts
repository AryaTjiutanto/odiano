import { useRef, useState } from "react";
import { handleAppErrorNotification } from "../helpers/errors/appError.helper";

const useDragAndDrop = () => {
    const [isDrag, setIsDrag] = useState<boolean>(false);
    const dragCounter = useRef(0);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();

        dragCounter.current++;
        setIsDrag(true);
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();

        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDrag(false);
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, fallback : (data : File | undefined) => void) => {
        e.preventDefault();

        try {
            dragCounter.current = 0;
            setIsDrag(false);
    
            fallback(e.dataTransfer.files[0]);
        } catch (err) {
            handleAppErrorNotification(err);
        }
    }

    return {
        isDrag,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
    }
}

export default useDragAndDrop