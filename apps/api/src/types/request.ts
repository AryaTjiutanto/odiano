import type {Request} from "express";

export type ReqBody<T> = Request<{},{},T>;