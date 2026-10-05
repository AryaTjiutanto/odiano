import "./bootstraps/env.bootstrap.js";
import { connectDB } from "./bootstraps/db.bootstrap.js";
import { startDeleteExpiredTempAssets } from "./jobs/deleteTempAssets.js";
import { createServer } from "http";
import app from "./app.js";
import { initializeSocket } from "./socket/index.js";

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