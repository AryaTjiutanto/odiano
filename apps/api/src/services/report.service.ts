import { PaginationQuery, REPORT_STATUS, REPORT_TYPE, ReportDTO, ReportReasonCode, ReportType } from "@odiano/shared";
import Report from "../models/report.model";
import { Types } from "mongoose";
import { REPORTS_PAGE_SIZE } from "../consts/report.const";
import { ReportAggregationQueryResult } from "../types/report.type";
import { toReportDTO } from "../mappers/report.mapper";
import logger from "../libs/log/logger";

export const createReport = async (currentUserId: string, reason: ReportReasonCode, type: ReportType, targetId: string) => {
    await Report.updateOne({
        reason,
        type,
        target: new Types.ObjectId(targetId),
        reporter: new Types.ObjectId(currentUserId),
    }, {
        $setOnInsert: {
            status: REPORT_STATUS.PENDING,
        }
    }, {
        upsert: true,
    });
}

export const getReports = async (status: string = REPORT_STATUS.PENDING, page: number = 1, withPagination : boolean = false) : Promise<PaginationQuery<ReportDTO[]>> => {
    const query = {
        ...(Object.values(REPORT_STATUS).includes(status) && { status }),
    };

    const reports = await Report.aggregate<ReportAggregationQueryResult>([
        {
            $match: query,
        },
        {
            $facet: {
                ...(withPagination && {
                    metadata: [
                        {
                            $count: "total"
                        }
                    ],
                }),
                data: [
                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },
                    {
                        $skip: (page - 1) * REPORTS_PAGE_SIZE,
                    },
                    {
                        $limit: REPORTS_PAGE_SIZE,
                    },

                    {
                        $lookup: {
                            from: "users",
                            localField: "reporter",
                            foreignField: "_id",

                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        username: 1,
                                        profileImage: 1,
                                    }
                                }
                            ],

                            as: "reporter"
                        }
                    },

                    {
                        $unwind: "$reporter",
                    },

                    {
                        $lookup: {
                            from: "users",

                            let: {
                                type: "$type",
                                targetId: "$target",
                            },

                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$_id", "$$targetId"] },
                                                { $eq: ["$$type", REPORT_TYPE.USER] },
                                            ]
                                        }
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        username: 1,
                                        profileImage: 1,
                                        name : 1,
                                    }
                                }
                            ],

                            as: "userTarget"
                        }
                    },
                    {
                        $lookup: {
                            from: "posts",

                            let: {
                                type: "$type",
                                targetId: "$target",
                            },

                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$_id", "$$targetId"] },
                                                { $eq: ["$$type", REPORT_TYPE.POST] },
                                            ]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        publicId: 1,
                                        content: 1,
                                        media: 1
                                    }
                                }
                            ],

                            as: "postTarget"
                        }
                    },
                    {
                        $lookup: {
                            from: "postComments",

                            let: {
                                type: "$type",
                                targetId: "$target",
                            },

                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$_id", "$$targetId"] },
                                                { $eq: ["$$type", REPORT_TYPE.COMMENT] },
                                            ]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        content: 1,
                                        depth: 1,
                                    }
                                }
                            ],

                            as: "postCommentTarget"
                        }
                    },

                    {
                        $set: {
                            target: {
                                type: "$type",
                                data: {
                                    $switch: {
                                        branches: [
                                            {
                                                case: {
                                                    $eq: ["$type", REPORT_TYPE.USER]
                                                },
                                                then: {
                                                    $arrayElemAt: ["$userTarget", 0]
                                                }
                                            },
                                            {
                                                case: {
                                                    $eq: ["$type", REPORT_TYPE.POST]
                                                },
                                                then: {
                                                    $arrayElemAt: ["$postTarget", 0]
                                                }
                                            },
                                            {
                                                case: {
                                                    $eq: ["$type", REPORT_TYPE.COMMENT]
                                                },
                                                then: {
                                                    $arrayElemAt: ["$postCommentTarget", 0]
                                                }
                                            },
                                        ],
                                        default: null
                                    }
                                }
                            }
                        }
                    },

                    // project
                    {
                        $project: {
                            _id: 1,
                            reporter: 1,
                            reason: 1,
                            target: 1,
                            status: 1,
                            createdAt: 1,
                            userTarget: 1,
                            postTarget: 1,
                            postCommentTarget: 1
                        }
                    }
                ]
            }
        }
    ]);

    const reportDTOs = reports[0].data.map(report => toReportDTO(report));

    return {
        pagination : (withPagination && reports[0].metadata && reports[0].metadata.length > 0) ? {
            itemPerPage : REPORTS_PAGE_SIZE,
            totalItem : reports[0].metadata[0].total || 0,
            totalPage : Math.ceil(reports[0].metadata[0].total / REPORTS_PAGE_SIZE),
        } : null,
        data : reportDTOs,
    }
}