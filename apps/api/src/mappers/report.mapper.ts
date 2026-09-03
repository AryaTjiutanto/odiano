import { REPORT_TYPE, ReportDTO } from "@odiano/shared";
import { ReportAggregationData } from "../types/report.type";

export const toReportDTO = (data : ReportAggregationData) : ReportDTO => {
    const target = (() => {
        switch (data.target.type) {
            case REPORT_TYPE.USER:
                return {
                    type : REPORT_TYPE.USER,
                    data : {
                        id : data.target.data._id.toString(),
                        username : data.target.data.username,
                        profileImage : data.target.data.profileImage,
                        name : data.target.data.name,
                    }
                }
            case REPORT_TYPE.POST:
                return {
                    type : REPORT_TYPE.POST,
                    data : {
                        id : data.target.data._id.toString(),
                        publicId : data.target.data.publicId,
                        content : data.target.data.content || null,
                        firstMedia : data.target.data.media?.[0] || null,
                    }
                }
            case REPORT_TYPE.COMMENT:
                return {
                    type : REPORT_TYPE.COMMENT,
                    data : {
                        id : data.target.data._id.toString(),
                        content : data.target.data.content,
                        depth : data.target.data.depth,
                    }
                }
        }
    })();

    return {
        id : data._id,
        reporter : {
            id : data.reporter._id.toString(),
            name : data.reporter.name,
            username : data.reporter.username,
            profileImage : data.reporter.profileImage,
        },
        reason : data.reason,
        target,
        status : data.status,
        createdAt : data.createdAt, 
    }
}