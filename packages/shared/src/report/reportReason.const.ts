import { REPORT_TYPE } from "./reportType.const";

export const REPORT_REASON_CODES = {
    // Common
    SPAM: "SPAM",
    HARASSMENT: "HARASSMENT",
    HATE_SPEECH: "HATE_SPEECH",
    VIOLENCE: "VIOLENCE",
    SEXUAL_CONTENT: "SEXUAL_CONTENT",
    ILLEGAL_CONTENT: "ILLEGAL_CONTENT",
    OTHER: "OTHER",

    // Post
    FALSE_INFORMATION: "FALSE_INFORMATION",
    INTELLECTUAL_PROPERTY: "INTELLECTUAL_PROPERTY",
    SELF_HARM: "SELF_HARM",

    // User
    FAKE_ACCOUNT: "FAKE_ACCOUNT",
    IMPERSONATION: "IMPERSONATION",
    SCAM: "SCAM",
    THREATS: "THREATS",
    INAPPROPRIATE_CONTENT: "INAPPROPRIATE_CONTENT",
    ILLEGAL_ACTIVITY: "ILLEGAL_ACTIVITY",
} as const;

export const REPORT_REASONS = {
    [REPORT_TYPE.POST]: [
        {
            code: REPORT_REASON_CODES.SPAM,
            description: "Spam or misleading content",
        },
        {
            code: REPORT_REASON_CODES.HARASSMENT,
            description: "Harassment or bullying",
        },
        {
            code: REPORT_REASON_CODES.HATE_SPEECH,
            description: "Hate speech or hateful content",
        },
        {
            code: REPORT_REASON_CODES.VIOLENCE,
            description: "Violence or dangerous content",
        },
        {
            code: REPORT_REASON_CODES.SEXUAL_CONTENT,
            description: "Sexual or explicit content",
        },
        {
            code: REPORT_REASON_CODES.FALSE_INFORMATION,
            description: "False or misleading information",
        },
        {
            code: REPORT_REASON_CODES.ILLEGAL_CONTENT,
            description: "Illegal or prohibited content",
        },
        {
            code: REPORT_REASON_CODES.INTELLECTUAL_PROPERTY,
            description: "Copyright or intellectual property violation",
        },
        {
            code: REPORT_REASON_CODES.SELF_HARM,
            description: "Self-harm or suicide-related content",
        },
    ],

    [REPORT_TYPE.COMMENT]: [
        {
            code: REPORT_REASON_CODES.SPAM,
            description: "Spam or unwanted content",
        },
        {
            code: REPORT_REASON_CODES.HARASSMENT,
            description: "Harassment or bullying",
        },
        {
            code: REPORT_REASON_CODES.HATE_SPEECH,
            description: "Hate speech or hateful content",
        },
        {
            code: REPORT_REASON_CODES.THREATS,
            description: "Threats or intimidation",
        },
        {
            code: REPORT_REASON_CODES.SEXUAL_CONTENT,
            description: "Sexual or explicit content",
        },
        {
            code: REPORT_REASON_CODES.VIOLENCE,
            description: "Violence or dangerous content",
        },
        {
            code: REPORT_REASON_CODES.ILLEGAL_CONTENT,
            description: "Illegal or prohibited content",
        },
    ],

    [REPORT_TYPE.USER]: [
        {
            code: REPORT_REASON_CODES.FAKE_ACCOUNT,
            description: "This account appears to be fake",
        },
        {
            code: REPORT_REASON_CODES.IMPERSONATION,
            description: "Pretending to be someone else",
        },
        {
            code: REPORT_REASON_CODES.HARASSMENT,
            description: "Harassment or bullying",
        },
        {
            code: REPORT_REASON_CODES.HATE_SPEECH,
            description: "Hate speech or hateful behavior",
        },
        {
            code: REPORT_REASON_CODES.SPAM,
            description: "Spam or abusive activity",
        },
        {
            code: REPORT_REASON_CODES.SCAM,
            description: "Scam or fraudulent activity",
        },
        {
            code: REPORT_REASON_CODES.THREATS,
            description: "Threats or intimidation",
        },
        {
            code: REPORT_REASON_CODES.INAPPROPRIATE_CONTENT,
            description: "Inappropriate or offensive content",
        },
        {
            code: REPORT_REASON_CODES.ILLEGAL_ACTIVITY,
            description: "Illegal or prohibited activity",
        },
    ],

} as const;

export type ReportReasonCode = typeof REPORT_REASON_CODES[keyof typeof REPORT_REASON_CODES];