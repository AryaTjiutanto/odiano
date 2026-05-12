import "./bootstraps/env.bootstrap";
import { connectDB } from "./bootstraps/db.bootstrap";
import express from "express";
import cors from "cors";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import {Request, Response, NextFunction} from "express";
import { AppError } from "./errors/appError.error";
import { errorResponseData } from "./utils/response.util";
import { ZodError } from "zod";
import { ERROR_RESPONSE_CODE, ValidationError } from "@connect/shared";
import helmet from "helmet";

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
app.use(cookieParser());
app.use(helmet());

app.use("/", routes);
app.use((err : any, req : Request, res:Response, next : NextFunction) => {
    if(err instanceof AppError) {
        return res.status(err.statusCode).json(errorResponseData(err.code, err.message, err.err));
    }

    if(err instanceof ZodError) {
        const errors = err.issues.map<ValidationError>(issue => ({
            path : issue.path.join("."),
            message : issue.message,
        }))

        return res.status(400).json(errorResponseData<ValidationError[]>(ERROR_RESPONSE_CODE.validationError, "validation error", errors));
    }
    
    res.status(500).json(errorResponseData(ERROR_RESPONSE_CODE.internalServerError, "Something went wrong"));
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
