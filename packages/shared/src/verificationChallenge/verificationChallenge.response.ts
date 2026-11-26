type RequireVerificationResponse = {
    requireVerification: true;
    requestVerificationToken: string;
};

export type VerificationResponse<T = {}> = RequireVerificationResponse | {
    requireVerification: false;
} & T;