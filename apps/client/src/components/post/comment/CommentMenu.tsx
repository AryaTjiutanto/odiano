import { FloatingPortal } from "@floating-ui/react"
import { Trash2 } from "lucide-react"
import type React from "react"
import { forwardRef } from "react"

type Handler = (data: any) => void

type Handlers = {
    delete?: Handler,
}

type Props = {
    style: React.CSSProperties,
    floatingProps: React.HTMLProps<HTMLDivElement>
    isOpen: boolean,
    handlers?: Handlers,
    role : "owner" | "viewer",
}

const CommentMenu = forwardRef<HTMLDivElement, Props>(({ isOpen, handlers, style, floatingProps, role}, ref) => {
    let items;
    
    if(role == "owner") {
        items = [
            {
                icon: Trash2,
                label: "delete",
                text: "Delete Comment",
                handler: handlers?.delete
            }
        ]
    }


    if (!isOpen) return null;

    return (
        <FloatingPortal>
            <div ref={ref} style={style} {...floatingProps} className="w-60 py-2 bg-neutral-950 rounded-xl text-neutral-100 overflow-hidden">
                {
                    items && items.map(item => {
                        const Icon = item.icon;
                        return (
                            <button className="w-full px-5 h-11 flex items-center justify-between cursor-pointer hover:bg-neutral-900 duration-100" key={item.label} onClick={item.handler}>
                                <div className="flex items-center space-x-3">
                                    <Icon className="w-4"/>
                                    <span>
                                        {item.text}
                                    </span>
                                </div>
                            </button>
                        )
                    })
                }
            </div>
        </FloatingPortal>
    )
})

export default CommentMenu