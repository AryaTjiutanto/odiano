import { ACTIONS, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, PaginationQuery, POST_COMMENT_STATUS, POST_STATUS, REPORT_STATUS, REPORT_TYPE, ReportDTO, ReportReasonCode, ReportType, SUBJECTS, UserSummaryDTO } from "@odiano/shared";
import Report from "../models/report.model";
import mongoose, { Types } from "mongoose";
import { REPORTS_PAGE_SIZE } from "../consts/report.const";
import { PostCommentReportTargetSchema, PostReportTargetSchema, ReportAggregationQueryResult, UserReportTargetSchema } from "../types/report.type";
import { toReportDTO } from "../mappers/report.mapper";
import { User } from "../models/user.model";
import { defineAbilityFor } from "../helpers/ability.helper";
import { Post } from "../models/post.model";
import PostComment from "../models/postComment.model";
import { create as createNotification } from "./notification.service";

export const createReport = async (currentUserId: string, reason: ReportReasonCode, type: ReportType, targetId: string) => {
    const report = await Report.findOne({
        reason,
        "target.type": type,
        "target.id": new Types.ObjectId(targetId),
        reporter: new Types.ObjectId(currentUserId),
    }).select("_id").lean();

    if (report) return;

    // get target data
    let target: PostReportTargetSchema | UserReportTargetSchema | PostCommentReportTargetSchema | null = null;

    if (type === REPORT_TYPE.POST) {
        const post = await Post.findById(targetId).select("publicId content media hashTags author").lean();

        if (!post) {
            throw new Error("Post not found");
        }

        target = {
            type: REPORT_TYPE.POST,
            id: post._id,
            snapshot: {
                publicId: post.publicId,
                content: post.content,
                media: post.media,
                hashTags: post.hashtags || null,
                author: post.author,
            }
        }
    } else if (type === REPORT_TYPE.USER) {
        const user = await User.findById(targetId).select("username profileImage name email").lean();

        if (!user) {
            throw new Error("User not found");
        }

        target = {
            type: REPORT_TYPE.USER,
            id: user._id,
            snapshot: {
                username: user.username,
                profileImage: user.profileImage,
                name: user.name,
                email: user.email,
            }
        }
    } else if (type === REPORT_TYPE.COMMENT) {
        const comment = await PostComment.findById(targetId).select("content depth author postId").lean();

        if (!comment) {
            throw new Error("Comment not found");
        }

        target = {
            type: REPORT_TYPE.COMMENT,
            id: comment._id,
            snapshot: {
                postId : comment.postId,
                author: comment.author,
                parentId: comment.parentId || null,
                content: comment.content,
                depth: comment.depth,
            }
        }
    }

    if (!target) {
        throw new Error("Target not found");
    }

    // create report
    await Report.create({
        reason,
        status: REPORT_STATUS.PENDING,
        reporter: new Types.ObjectId(currentUserId),
        target,
    })
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
                .select("_id status reason type reporter target createdAt");

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

            // take action
            if (report.target.type === REPORT_TYPE.POST) {
                // suspend post
                await Post.updateOne({
                    _id: report.target.id,
                }, {
                    $set: {
                        status: POST_STATUS.SUSPENDED,
                    }
                }, { session });


                // create notification
                const target = report.target.snapshot;
                const author = await User.findById(report.target.snapshot.author).select("username profileImage name email").lean();
                const authorData : UserSummaryDTO | null = author ? {
                    username : author?.username,
                    profileImage : author?.profileImage,
                    name : author?.name,
                    id : author?._id.toString(),
                } : null;

                const targetSnapshot = {
                    type : NOTIFICATION_TARGET_TYPE.POST,
                    id: report.target.id.toString(),
                    createdAt : report.createdAt,
                    publicId: target.publicId,
                    ...(target.content && {
                        content: target.content,
                    }),
                    ...(target.media && {
                        firstMedia: {
                            type: target.media[0].type,
                            aspectRatio: target.media[0].aspectRatio,
                            url: target.media[0].source.url,
                            publicId: target.media[0].source.publicId,
                        }
                    }),
                    ...(authorData && {author : authorData}),
                };

                const reportSnapshot = {
                    type : NOTIFICATION_TARGET_TYPE.REPORT,
                    id: report._id.toString(),
                    reason: report.reason,
                }

                await createNotification(report.target.snapshot.author.toString(), null, {
                    type: NOTIFICATION_TYPE.SUSPEND,
                    target: targetSnapshot,
                    report: reportSnapshot
                }, session)

                await createNotification(report.reporter.toString(), null, {
                    type: NOTIFICATION_TYPE.REPORT,
                    target: targetSnapshot,
                    report: {
                        ...reportSnapshot,
                        createdAt: report.createdAt,
                    },
                    status: REPORT_STATUS.RESOLVED,
                })
            } else if(report.target.type === REPORT_TYPE.COMMENT) {
                // suspend comment
                await PostComment.updateOne({
                    _id : report.target.id,
                }, {
                    $set : {
                        status : POST_COMMENT_STATUS.SUSPENDED,
                    }
                }, {session})

                // reduce post comment count
                await Post.updateOne({
                    _id : report.target.snapshot.postId,
                }, {
                    $inc : {
                        commentCount : -1,
                    }
                }, {session});
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
                                type: "$target.type",
                                targetId: "$target.id",
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
                                type: "$target.type",
                                targetId: "$target.id",
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
                                type: "$target.type",
                                targetId: "$target.id",
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
                                    }
                                }
                            ],

                            as: "postCommentTarget"
                        }
                    },

                    {
                        $set: {
                            target: {
                                type: "$target.type",
                                id: "$target.id",
                                snapshot: "$target.snapshot",
                                exists: {
                                    $or: [
                                        { $gt: [{ size: "$userTarget" }, 0] },
                                        { $gt: [{ size: "$postTarget" }, 0] },
                                        { $gt: [{ size: "$postCommentTarget" }, 0] },
                                    ]
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