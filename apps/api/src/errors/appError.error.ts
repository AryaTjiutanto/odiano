import { ErrorResponseCode } from "@connect/shared";

export class AppError extends Error {
    statusCode : number;
    code : ErrorResponseCode;
    err : any | null;

    constructor(statusCode : number, code : ErrorResponseCode, message : string, err : any | null = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.err = err;
    }
}