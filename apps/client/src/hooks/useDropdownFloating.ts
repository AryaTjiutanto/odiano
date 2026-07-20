import { autoUpdate, flip, shift, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import { useState } from "react";

const useDropdownFloating = <T> (fn : (data : T) => void) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [value, setValue] = useState<T | null>(null);

    const selectValue = (value: T) => {
        setValue(value);
        setIsOpen(false);
        fn(value);
    }

    const { refs, context, floatingStyles } = useFloating({
        placement: "bottom",
        middleware: [
            shift(),
            flip()
        ],
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted : autoUpdate,
    })

    const dismiss = useDismiss(context);
    const click = useClick(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click]);

    return {
        getReferenceProps,
        getFloatingProps,
        refs,
        selectValue,
        floatingStyles,
        value,
        isOpen
    }
}

export default useDropdownFloating;