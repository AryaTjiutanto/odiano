import { toast } from "react-hot-toast";
import Toast from "../components/toast/Toast";

export const notify = {
    success(title : string, description : string) {
        return toast.custom((t) => (
            <Toast t={t} title={title} description={description} type="success"/>
        ))
    },
    info(title : string, description : string) {
        return toast.custom(t => (
            <Toast t={t} title={title} description={description} type="info"/>
        ))
    },
    error(title : string, description : string) {
        return toast.custom(t => (
            <Toast t={t} title={title} description={description} type="error"/>
        ))
    },
    warning(title : string, description : string) {
        return toast.custom(t => (
            <Toast t={t} title={title} description={description} type="warning"/>
        ))
    }
}