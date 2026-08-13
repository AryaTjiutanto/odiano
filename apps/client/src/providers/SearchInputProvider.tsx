import { createContext, useContext, useState } from "react";

type SearchInputContextType = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    isSearchPanelOpen: boolean,
    setIsSearchPanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleClickSuggestion: (query: string, fn?: () => void) => void,
}

const SearchInputContext = createContext<SearchInputContextType | null>(null);

const SearchInputProvider = ({ children }: any) => {
    const [query, setQuery] = useState<string>("");
    const [isSearchPanelOpen, setIsSearchPanelOpen] = useState<boolean>(false);

    const handleClickSuggestion = (query: string, fn?: () => void) => {
        setIsSearchPanelOpen(false);
        setQuery(query);

        if (!fn) return;
        fn();
    }

    return (
        <SearchInputContext.Provider value={{
            query,
            setQuery,
            isSearchPanelOpen,
            setIsSearchPanelOpen,
            handleClickSuggestion,
        }}>
            {children}
        </SearchInputContext.Provider>
    )
}

export default SearchInputProvider;

export const useSearchInputContext = () => {
    const context = useContext(SearchInputContext);

    if (!context) {
        throw new Error("useSearchInputContext must be used within a SearchInputProvider");
    }

    return context;
}