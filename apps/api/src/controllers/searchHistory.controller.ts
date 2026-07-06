import { Request, Response, NextFunction } from "express";
import { getSearchHistory } from "../services/searchHistory.service";
import { successResponseData } from "../utils/response.util";
import { InfiniteQuery, SearchDTO } from "@connect/shared";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     const result = await getSearchHistory();

    //     res.status(200).json(successResponseData<InfiniteQuery<SearchDTO>>())
    // } catch (err) {
    //     next(err);
    // }
}