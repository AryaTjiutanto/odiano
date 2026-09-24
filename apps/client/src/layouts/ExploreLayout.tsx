import { Outlet } from "react-router-dom";
import { ExploreHeader } from "../components/social/ExploreHeader";
import { SearchSectionProvider } from "../providers/SearchSectionProvider";

const ExploreLayout = () => {
    return (
        <>
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