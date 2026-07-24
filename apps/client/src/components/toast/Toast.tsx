import { AlertCircle, Check, CircleX, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { type Toast as ToastType } from "react-hot-toast";

type ToastProps = {
    t: ToastType,
    title: string,
    description?: string,
    element?: ReactNode,
    type: "info" | "warning" | "error" | "success"
};

const Toast = ({ t, title, description, element, type }: ToastProps) => {
    const metadata = {
        info: {
            icon: <Info className="size-5" />,
            iconColor: "text-sky-500",
            iconBackground: "bg-sky-500/20",
            borderColor: "border-neutral-200",
            glowColor: "bg-sky-500/20",
        },
        success: {
            icon: <Check className="size-5" />,
            iconColor: "text-emerald-500",
            iconBackground: "bg-emerald-500/20",
            borderColor: "border-emerald-400",
            glowColor: "bg-emerald-500/20",
        },
        error: {
            icon: <CircleX className="size-5" />,
            iconColor: "text-red-500",
            iconBackground: "bg-red-500/20",
            borderColor: "border-red-500",
            glowColor: "bg-red-500/20",
        },
        warning: {
            icon: <AlertCircle className="size-5" />,
            iconColor: "text-yellow-400",
            iconBackground: "bg-yellow-500/20",
            borderColor: "border-yellow-400",
            glowColor: "bg-yellow-500/20",
        }
    }

    const selectedMetadata = metadata[type];

    return (
        <div
            className={`${t.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                } max-w-sm w-full bg-neutral-950/70 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 duration-100 text-neutral-100 relative backdrop-blur-2xl overflow-hidden`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5 flex items-center">
                        <div className={`w-8 h-8 rounded-full ${selectedMetadata.iconBackground} grid place-content-center ${selectedMetadata.iconColor}`}>
                            {selectedMetadata.icon}
                        </div>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-white">
                            {title || ""}
                        </p>
                        {
                            description &&
                            <p className="mt-1 text-sm text-gray-400">
                                {description || ""}
                            </p>
                        }
                        {element && element}
                    </div>
                </div>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="absolute top-3 right-4 cursor-pointer hover:text-white text-neutral-200 duration-100">
                <X className="text-xs" />
            </button>

            <div className={`h-[200%] aspect-square absolute -left-[15%] rounded-full blur-[100px] ${selectedMetadata.glowColor}`}></div>
        </div>
    )
}

export default Toast;