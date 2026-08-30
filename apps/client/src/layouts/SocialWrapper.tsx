import { Outlet } from "react-router-dom";
import { PostFormProvider } from "../providers/PostFormProvider";
import ReportFormProvider from "../providers/ReportFormProvider";

const SocialWrapper = () => {
    return (
        <ReportFormProvider>
            <PostFormProvider>
                <Outlet />
            </PostFormProvider>
        </ReportFormProvider>
    )
}

export default SocialWrapper