import { Outlet } from "react-router-dom";
import SearchInputProvider from "../providers/SearchInputProvider";

const SearchWrapper = () => {
    return (
        <>
            <SearchInputProvider>
                <Outlet/>
            </SearchInputProvider>
        </>
    )
}

export default SearchWrapper;