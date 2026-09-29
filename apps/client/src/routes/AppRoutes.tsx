import { Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PageLoader from "../components/loader/PageLoader";
import SocialWrapper from "../layouts/SocialWrapper";
import SocialLayout from "../layouts/SocialLayout";
import SearchWrapper from "../layouts/SearchWrapper";
import ExploreLayout from "../layouts/ExploreLayout";
import Explore from "../pages/Social/Explore";
import { Search } from "lucide-react";
import Homepage from "../pages/Social/Home";
import ShowPost from "../pages/Post/ShowPost";
import ProfileWrapper from "../layouts/ProfileWrapper";
import RequireAuthGuard from "../guard/RequireAuthGuard";
import NotificationModalWrapper from "../layouts/NotificationModalWrapper";
import Profile from "../pages/Social/Profile";
import Notification from "../pages/Social/Notification";
import EditProfile from "../pages/Social/EditProfile";
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
import NotFoundPage from "../pages/error/NotFoundPage";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route element={<PageLoader />}>
                        {/* social */}
                        <Route element={<SocialWrapper />}>
                            <Route element={<SocialLayout />}>
                                <Route element={<SearchWrapper />}>
                                    <Route element={<ExploreLayout />}>
                                        <Route path='/explore' element={<Explore />} />
                                        <Route path='/search' element={<Search />} />
                                    </Route>

                                    <Route path='/' element={<Homepage />} />
                                </Route>

                                {/* post */}
                                <Route path='/:username/post/:postPublicId' element={<ShowPost />} />

                                {/* profile */}
                                <Route element={<ProfileWrapper />}>
                                    <Route path='/profile/:username' element={<Profile />} />
                                </Route>

                                {/* require auth */}
                                <Route element={<RequireAuthGuard />}>
                                    <Route element={<NotificationModalWrapper />}>
                                        <Route path='/notification' element={<Notification />} />
                                    </Route>

                                    <Route path='/profile/edit' element={<EditProfile />} />
                                </Route>
                            </Route>
                        </Route>

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

                        {/* not fond */}
                        <Route path='*' element={<NotFoundPage />} />
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes;