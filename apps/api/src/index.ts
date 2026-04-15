import "./bootstrap/env";
import { connectDB } from "./bootstrap/db";
import express from "express";
import cors from "cors";
import routes from "./routes/index";

const PORT = process.env.PORT || "5050";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "localhost:5050";

connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin : ALLOWED_ORIGINS?.split(",").map((o) => o.trim()),
    credentials : true,
    methods : ["POST", "GET", "DELETE", "PUT"]
}));

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
