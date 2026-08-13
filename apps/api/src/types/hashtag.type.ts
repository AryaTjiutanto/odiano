import { Types } from "mongoose"

export type HashTagSummaryQuery = {
    _id : Types.ObjectId,
    name : string,
    totalPost : number,    
}