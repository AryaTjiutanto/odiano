import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { redis } from "../libs/redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { socketAuth } from "./middleware";

let io : Server;

const pubClient = redis;
const subClient = pubClient.duplicate();

export const initializeSocket = (server : HttpServer) => {
    io = new Server(server, {
        adapter : createAdapter(pubClient, subClient)
    });

    io.use(socketAuth);
}

export const getIo = () => io;