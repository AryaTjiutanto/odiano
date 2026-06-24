import { socket } from "../../libs/socket"

export const registerNotificationListeners = () => {
    socket.on("notification:new", (notification) => {
        console.log(notification);
    })
}

export const unregisterNotificationListeners = () => {
    socket.off("notification:new");
}