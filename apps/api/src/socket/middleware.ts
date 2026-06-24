import { Socket } from "socket.io";
import { verifyAccessToken } from "../libs/auth/auth.token";

export const socketAuth = (socket : Socket, next : Function) => {
    try {
        const userId = socket.handshake.auth.token;
        const decoded = verifyAccessToken(userId);

        socket.data.userId = decoded.userId;

        socket.join(`user:${socket.data.userId}`);

        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
};