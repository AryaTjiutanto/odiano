import { createContext, useContext, useState } from "react";

type Section = "posts" | "people" | "media" | "hashtags";

type SearchSectionContextType = {
    currentSection : Section,
    setCurrentSection: (section: Section) => void,
}

const SearchSectionContext = createContext<SearchSectionContextType | null>(null);

export const SearchSectionProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentSection, setCurrentSection] = useState<Section>("posts");

    return (
        <SearchSectionContext.Provider value={{ currentSection, setCurrentSection }}>
            {children}
        </SearchSectionContext.Provider>
    )
}

export const useSearchSectionContext = () => {
    const context = useContext(SearchSectionContext);

    if (!context) {
        throw new Error("useSearchSectionContext must be used within a SearchSectionProvider");
    }

    return context;
}