import { EmailQueueData } from "@odiano/queue";
import resend from "../lib/resend/resend.js";

export const sendEmail = async (data : EmailQueueData) => {
    const response = await resend.emails.send({
        from : "Support <support@aryatjiutanto.my.id>",
        to : data.email,
        subject : "Your OTP Code",
        html : data.content,
    });

    return response;
}