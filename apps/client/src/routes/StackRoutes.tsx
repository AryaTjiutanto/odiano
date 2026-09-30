import { Routes, Route } from "react-router-dom";
import SocialWrapper from "../layouts/SocialWrapper";
import SocialLayout from "../layouts/SocialLayout";
import SearchWrapper from "../layouts/SearchWrapper";
import ExploreLayout from "../layouts/ExploreLayout";
import Explore from "../pages/Social/Explore";
import Homepage from "../pages/Social/Home";
import ShowPost from "../pages/Post/ShowPost";
import ProfileWrapper from "../layouts/ProfileWrapper";
import RequireAuthGuard from "../guard/RequireAuthGuard";
import Profile from "../pages/Social/Profile";
import NotificationModalWrapper from "../layouts/NotificationModalWrapper";
import Notification from "../pages/Social/Notification";
import EditProfile from "../pages/Social/EditProfile";
import Search from "../pages/Social/Search";
import AppLayout from "../layouts/AppLayout";
import PageLoader from "../components/loader/PageLoader";

const StackRoutes = () => {
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
                    </Route>
                </Route>
            </Routes >
        </>
    )
}

export default StackRoutes;