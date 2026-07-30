import { flip, FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import type React from "react";
import { cloneElement, useState } from "react";

type Props = {
    trigger: React.ReactElement<React.ComponentPropsWithRef<"button">>;
    children: React.ReactNode;
};

const FloatingMenu = ({ trigger, children }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { refs, floatingStyles, context } = useFloating({
        placement : "top-end",
        middleware : [
            shift(),
            offset(10),
            flip(),
        ],
        open : isOpen,
        onOpenChange : setIsOpen,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    const triggerElement = cloneElement(trigger, {
        ref: refs.setReference,
        ...getReferenceProps(),
    })

    return (
        <>
            {triggerElement}
            {
                isOpen &&
                <FloatingPortal>
                    <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="w-60 py-2 bg-neutral-900 rounded-xl text-neutral-100 overflow-hidden z-25">
                        {children}
                    </div>
                </FloatingPortal>
            }
        </>
    )
}

export default FloatingMenu;