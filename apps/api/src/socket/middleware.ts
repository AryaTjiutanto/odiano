import { Socket } from "socket.io";
import { verifyAccessToken } from "../libs/auth/auth.token.js";

export const socketAuth = (socket : Socket, next : Function) => {
    try {
        const token = socket.handshake.auth.token;
        const decoded = verifyAccessToken(token);

        socket.data.userId = decoded.userId;

        socket.join(`user:${socket.data.userId}`);

        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
};