import { NotificationDTO } from "@odiano/shared";
import { getIo } from "../index.js";

export const emitToUser = (notificaton : NotificationDTO, userId : string) => {
    const io = getIo();
    io.to(`user:${userId}`).emit(`notification:new`, notificaton);
}