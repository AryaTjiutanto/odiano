import { Outlet } from "react-router-dom";
import ReportFormProvider from "../providers/ReportFormProvider";
import { PostFormProvider } from "../providers/PostFormProvider";
import SocialLayout from "./SocialLayout";

const SocialWrapper = () => {
    return (
        <ReportFormProvider>
            <PostFormProvider>
                <SocialLayout>
                    <Outlet/>
                </SocialLayout>
            </PostFormProvider>
        </ReportFormProvider>
    )
}

export default SocialWrapper;