import { toast } from "react-hot-toast";
import type { ReactNode } from "react";
import Toast from "../../components/toast/Toast";

type NotifyProps = {
    title : string,
    description? : string,
    element? : ReactNode,
}

export const notify = {
    success(props : NotifyProps) {
        return toast.custom((t) => (
            <Toast t={t} title={props.title} description={props.description} element={props.element} type="success"/>
        ))
    },
    info(props : NotifyProps) {
        return toast.custom(t => (
            <Toast t={t} title={props.title} description={props.description} element={props.element} type="info"/>
        ))
    },
    error(props : NotifyProps) {
        return toast.custom(t => (
            <Toast t={t} title={props.title} description={props.description} element={props.element} type="error"/>
        ))
    },
    warning(props : NotifyProps) {
        return toast.custom(t => (
            <Toast t={t} title={props.title} description={props.description} element={props.element} type="warning"/>
        ))
    }
}