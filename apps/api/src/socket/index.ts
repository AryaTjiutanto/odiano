import "../bootstraps/env.bootstrap";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { socketAuth } from "./middleware";
import { getRedis } from "@connect/redis";

let io : Server;

const pubClient = getRedis();
const subClient = pubClient.duplicate();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

export const initializeSocket = (server : HttpServer) => {
    io = new Server(server, {
        adapter : createAdapter(pubClient, subClient),
        cors : {
            origin : ALLOWED_ORIGINS?.split(",").map((o) => o)
        }
    });

    io.use(socketAuth);
}

export const getIo = () => io;