import "../../bootstraps/env.bootstrap.js";
import jwt from "jsonwebtoken";
import { RequestVerificationTokenPayload } from "./verification.type.js";
import { TokenPayload } from "../auth/auth.types.js";
import { UnauthorizedError } from "../../errors/unauthorized.error.js";

const requestVerificationSecret = process.env.REQUEST_VERIFICATION_SECRET;

export const generateRequestVerificationToken = (payload : RequestVerificationTokenPayload) : string => {
    if(!requestVerificationSecret) {
        throw new Error("Request verificationSecret is missing");
    }

    return jwt.sign(payload, requestVerificationSecret, {
        expiresIn : "10m"
    })
}

export const verifyRequestVerificationToken = (token : string) : TokenPayload<RequestVerificationTokenPayload> => {
    if(!requestVerificationSecret) {
        throw new Error("Access Token secret is missing");
    }

    try {
        const decoded = jwt.verify(token, requestVerificationSecret);
    
        if(typeof decoded === "string") {
            throw new UnauthorizedError();
        }
    
        return decoded as TokenPayload<RequestVerificationTokenPayload>;
    } catch(err) {
        if(err instanceof UnauthorizedError) {
            throw err
        }

        throw new UnauthorizedError("Expired or invalid token");
    }
}