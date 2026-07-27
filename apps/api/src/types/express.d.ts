import { UserSummaryDTO } from "@odiano/shared";

export {};

declare global {
    namespace Express {
        interface Request {
            userId? : string,
            tokenId? : string,
        }
    }
}