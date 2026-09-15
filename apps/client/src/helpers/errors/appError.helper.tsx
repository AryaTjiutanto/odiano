import { AppError } from "../../errors/appError"
import { notify } from "../notification/notify.helper"

export const handleAppErrorNotification = (err : unknown) => {
    if(err instanceof AppError) {
        notify.error({
            title : err.title,
            description : err.message,
        })
    }
}