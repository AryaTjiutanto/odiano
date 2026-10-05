import { REPORT_TYPE, ReportDTO } from "@odiano/shared";
import { ReportAggregationData } from "../types/report.type.js";

export const toReportDTO = (data: ReportAggregationData): ReportDTO => {
    const targetData = (() => {
        switch (data.target.type) {
            case REPORT_TYPE.USER:
                return {
                    type: REPORT_TYPE.USER,
                    snapshot: {
                        username: data.target.snapshot.username,
                        profileImage: data.target.snapshot.profileImage,
                        name: data.target.snapshot.name,
                        email: data.target.snapshot.email,
                    }
                }
            case REPORT_TYPE.POST:
                return {
                    type: REPORT_TYPE.POST,
                    snapshot: {
                        publicId: data.target.snapshot.publicId,
                        content: data.target.snapshot.content || null,
                        media: data.target.snapshot.media || null,
                        hashTags: data.target.snapshot.hashTags,
                        author: data.target.snapshot.author.toString(),
                    }
                }
            case REPORT_TYPE.COMMENT:
                return {
                    type: REPORT_TYPE.COMMENT,
                    snapshot: {
                        postId : data.target.snapshot.postId.toString(),
                        parentId : data.target.snapshot.parentId ? data.target.snapshot.parentId.toString() : null,
                        author : data.target.snapshot.author.toString(),
                        content: data.target.snapshot.content,
                        depth: data.target.snapshot.depth,
                    }
                }
        }
    })();

    return {
        id: data._id,
        reporter: {
            id: data.reporter._id.toString(),
            name: data.reporter.name,
            username: data.reporter.username,
            profileImage: data.reporter.profileImage,
        },
        reason: data.reason,
        target : {
            exists : data.target.isExists,
            id : data.target.id.toString(),
            ...targetData
        },
        status: data.status,
        createdAt: data.createdAt,
    }
}