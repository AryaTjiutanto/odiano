import { Outlet } from "react-router-dom";
import Sidebar from "../components/social/Sidebar";
import { lazy, Suspense, useState } from "react";

const CreatePostFormSection = lazy(() =>
    import("../components/post/PostFormSection")
)

const SocialLayout = () => {
    const [showCreatePostFormSection, setShowCreatePostFormSection] = useState<boolean>(false);

    return (
        <div className="w-full min-h-screen px-16 2xl:px-40">
            {
                showCreatePostFormSection &&
                <Suspense fallback={<div className="w-screen h-screen fixed bg-neutral-950/80 top-0 left-0 z-20"></div>}>
                    <CreatePostFormSection setShowCreatePostFormSection={setShowCreatePostFormSection}/>
                </Suspense>
            }
            <div className="w-full h-full grid grid-cols-12 2xl:grid-cols-11 gap-16 relative">
                <div className="h-screen col-span-3 2xl:col-span-3 py-10 sticky top-0">
                    <Sidebar setShowCreatePropsSection={setShowCreatePostFormSection}/>
                </div>
                <main className="col-span-6 2xl:col-span-5 pt-10">
                    <Outlet />
                </main>
                <div className="col-span-3 2xl:col-span-3 pt-10">
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default SocialLayout;