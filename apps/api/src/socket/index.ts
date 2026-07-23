import "../bootstraps/env.bootstrap";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import {redis} from "@connect/redis"
import { createAdapter } from "@socket.io/redis-adapter";
import { socketAuth } from "./middleware";

let io : Server;

const pubClient = redis;
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