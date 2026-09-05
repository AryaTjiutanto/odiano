import { ACTIONS, PaginationQuery, REPORT_STATUS, REPORT_TYPE, ReportDTO, ReportReasonCode, ReportType, SUBJECTS } from "@odiano/shared";
import Report from "../models/report.model";
import mongoose, { Types } from "mongoose";
import { REPORTS_PAGE_SIZE } from "../consts/report.const";
import { ReportAggregationQueryResult } from "../types/report.type";
import { toReportDTO } from "../mappers/report.mapper";
import { User } from "../models/user.model";
import { defineAbilityFor } from "../helpers/ability.helper";
import { Post } from "../models/post.model";
import PostComment from "../models/postComment.model";
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

export const processReport = async (currentUserId: string, reportId: string) => {
    // user
    const user = await User.findById(currentUserId).select("role").lean();

    if (!user) {
        throw new Error("User not found");
    }

    // ability
    const ability = defineAbilityFor(currentUserId, user.role);

    if (!ability.can(ACTIONS.UPDATE, SUBJECTS.REPORT)) {
        throw new Error("You don't have permission to process report");
    }

    // update report
    await Report.updateOne({
        _id: reportId,
    }, {
        $set: {
            status: REPORT_STATUS.REVIEWING
        }
    });
}

export const takeAction = async (currentUserId: string, reportId: string) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const user = await User.findById(currentUserId)
                .session(session)
                .select("role")
                .lean();

            if (!user) {
                throw new Error("User not found");
            }

            // ability
            const ability = defineAbilityFor(currentUserId, user.role);

            if (!ability.can(ACTIONS.UPDATE, SUBJECTS.REPORT) || !ability.can(ACTIONS.DELETE, SUBJECTS.POST)) {
                throw new Error("You don't have permission to take action");
            }

            
            // get report
            const report = await Report.findById(reportId)
            .session(session)
            .select("_id status reason type reporter target");

            if (!report) {
                throw new Error("Report not found");
            }
            
            if (report.status !== REPORT_STATUS.REVIEWING) {
                throw new Error("Report is not in reviewing status");
            }
            
            // update report status
            await report.updateOne({
                $set: {
                    status: REPORT_STATUS.RESOLVED
                }
            }).session(session);
            report.save();

            // delete report content
            if (report.type === REPORT_TYPE.USER) {
                await User.findByIdAndDelete(report.target)
                    .session(session);
            } else if (report.type === REPORT_TYPE.POST) {
                await Post.findByIdAndDelete(report.target)
                    .session(session);
            } else if (report.type === REPORT_TYPE.COMMENT) {
                await PostComment.findByIdAndDelete(report.target)
                    .session(session);
            }
        })
    } finally {
        await session.endSession();
    }

}

export const getReports = async (status: string = REPORT_STATUS.PENDING, page: number = 1, withPagination: boolean = false): Promise<PaginationQuery<ReportDTO[]>> => {
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
                                        name: 1,
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
                        }
                    }
                ]
            }
        }
    ]);

    const reportDTOs = reports[0].data.map(report => toReportDTO(report));

    return {
        pagination: (withPagination && reports[0].metadata && reports[0].metadata.length > 0) ? {
            itemPerPage: REPORTS_PAGE_SIZE,
            totalItem: reports[0].metadata[0].total || 0,
            totalPage: Math.ceil(reports[0].metadata[0].total / REPORTS_PAGE_SIZE),
        } : null,
        data: reportDTOs,
    }
}