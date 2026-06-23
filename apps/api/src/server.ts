import "./bootstraps/env.bootstrap";
import { connectDB } from "./bootstraps/db.bootstrap";
import { startDeleteExpiredTempAssets } from "./jobs/deleteTempAssets";
import { createServer } from "http";
import app from "./app";
import { initializeSocket } from "./socket";

const PORT = process.env.PORT || "5050";

// database
connectDB();

// cron jobs
startDeleteExpiredTempAssets();

// create server
const server = createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
    console.log(`App run on port ${PORT}`)
})