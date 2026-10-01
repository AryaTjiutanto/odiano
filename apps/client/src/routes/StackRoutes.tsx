import { Routes, Route } from "react-router-dom";
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
import { useStackProvider } from "../providers/StackProvider";
import NotFoundPage from "../pages/error/NotFoundPage";
import StackWrapper from "../layouts/StackWrapper";

const StackRoutes = () => {
    const { stack } = useStackProvider();

    return (
        <>
            {
                stack.map((item, index) => {
                    const isTop = index == stack.length - 1;

                    return (
                        <Routes location={item.location}>
                            <Route element={<StackWrapper isTop={isTop} />}>
                                {/* social */}
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

                                <Route path='*' element={<NotFoundPage />} />
                            </Route>
                        </Routes >
                    )
                })
            }
        </>
    )
}

export default StackRoutes;