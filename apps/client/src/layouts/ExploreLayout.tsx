import { Outlet } from "react-router-dom";
import { ExploreHeader } from "../components/social/ExploreHeader";
import { SearchSectionProvider } from "../providers/SearchSectionProvider";

const ExploreLayout = () => {
    return (
        <>
            {/* head */}
            <title>Explore - Odiano</title>
            <meta
                name="description"
                content="odiano with friends, share posts, and explore communities."
            />

            {/* body */}
            <SearchSectionProvider>
                <div>
                    <ExploreHeader />
                    <main className="">
                        <Outlet />
                    </main>
                </div>
            </SearchSectionProvider>
        </>
    )
}

export default ExploreLayout;