import mongoose from "mongoose";
import logger from "../libs/log/logger.js";

export const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        throw new Error("MONGO URI is missing");
    }

    mongoose.set("sanitizeFilter", true);

    await mongoose.connect(MONGO_URI)
        .then(() => {
            logger.info("Mongodb successfully connected");
        })
        .catch(() => {
            logger.error("Failed to odiano to mongodb");
        })
}