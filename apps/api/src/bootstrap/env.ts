import dotenv from "dotenv";

dotenv.config();
dotenv.config({path : `.env.${process.env.NODE_ENV || "development"}`})