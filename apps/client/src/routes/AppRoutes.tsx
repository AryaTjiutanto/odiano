import { Route, Routes } from "react-router-dom";
import RequireAuthGuard from "../guard/RequireAuthGuard";
import RequireGuestGuard from "../guard/RequireGuestGuard";
import AuthLayout from "../layouts/AuthLayout";
import Signin from "../pages/Auth/Signin";
import Signup from "../pages/Auth/Signup";
import RequireUnVerify from "../guard/RequireUnVerify";
import EmailVerification from "../pages/Auth/EmailVerification";
import RequireUnOnboarded from "../guard/RequireUnOnboarded";
import OnBoarding from "../pages/OnBoarding";
import RequireRoleGuard from "../guard/RequireRoleGuard";
import { ROLES } from "@odiano/shared";
import DashboardLayout from "../layouts/DashboardLayout";
import HomeAdminDashboard from "../pages/admin/Dashboard/Home";
import StackRoutes from "./StackRoutes";
import SocialWrapper from "../layouts/SocialWrapper";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                {/* auth process */}
                <Route element={<RequireGuestGuard />}>
                    <Route element={<AuthLayout />}>
                        <Route path='/signin' element={<Signin />} />
                        <Route path='/signup' element={<Signup />} />
                    </Route>
                </Route>

                {/* email verification */}
                <Route element={<RequireUnVerify
                />}>
                    <Route path='/email/verify' element={<EmailVerification />} />
                </Route>

                {/* onboarding */}
                <Route element={<RequireUnOnboarded />}>
                    <Route path='/onboarding' element={<OnBoarding />} />
                </Route>

                {/* admin dashboard */}
                <Route element={<RequireAuthGuard />}>
                    <Route element={<RequireRoleGuard role={ROLES.ADMIN} />}>
                        <Route element={<DashboardLayout />}>
                            <Route path='/admin/dashboard' element={<HomeAdminDashboard />} />
                        </Route>
                    </Route>
                </Route>

                {/* stack routes */}

                <Route element={<SocialWrapper/>}>
                    <Route path="*" element={<StackRoutes />} />
                </Route>

                {/* not fond */}
                {/* <Route path='*' element={<NotFoundPage />} /> */}
            </Routes>

            {/* stack */}
            {/* <ReportFormProvider>
                <PostFormProvider>
                    <StackViewport />
                </PostFormProvider>
            </ReportFormProvider> */}
        </>
    )
}

export default AppRoutes;