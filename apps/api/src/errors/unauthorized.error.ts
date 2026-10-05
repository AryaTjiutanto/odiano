import { AppError } from "./appError.error.js";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(401, "UNAUTHORIZED", message);
    }
}