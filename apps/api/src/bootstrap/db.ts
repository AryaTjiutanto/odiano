import mongoose from  "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if(!MONGO_URI) {
    throw new Error("MONGO URI is missing");
}

export const connectDB = async () => {
    await mongoose.connect(MONGO_URI)
        .then(() => {
            console.log("Mongodb successfully connected");
        })
        .catch(() => {
            console.log("Failed to connect to mongodb");
        })
}