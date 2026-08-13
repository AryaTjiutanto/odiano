import { Outlet } from "react-router-dom";
import SearchInputProvider from "../providers/SearchInputProvider";

const SearchLayout = () => {
    return (
        <>
            <SearchInputProvider>
                <Outlet/>
            </SearchInputProvider>
        </>
    )
}

export default SearchLayout;