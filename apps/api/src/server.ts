import "./bootstraps/env.bootstrap.js";
import { connectDB } from "./bootstraps/db.bootstrap.js";
import { createServer } from "http";
import app from "./app.js";
import { initializeSocket } from "./socket/index.js";

const PORT = process.env.PORT || "5050";

// database
connectDB();

// create server
const server = createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
    console.log(`App run on port ${PORT}`)
})