import { Outlet } from "react-router-dom";
import ReportFormProvider from "../providers/ReportFormProvider";
import { PostFormProvider } from "../providers/PostFormProvider";
import SocialLayout from "./SocialLayout";
import { SearchInputProvider } from "../providers/SearchInputProvider";

const SocialWrapper = () => {
    return (
        <ReportFormProvider>
            <PostFormProvider>
                <SearchInputProvider>
                    <SocialLayout>
                        <Outlet />
                    </SocialLayout>
                </SearchInputProvider>
            </PostFormProvider>
        </ReportFormProvider>
    )
}

export default SocialWrapper;