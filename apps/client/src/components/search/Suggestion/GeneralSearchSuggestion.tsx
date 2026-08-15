import { Search } from "lucide-react"

type Props = {
    value : String,
}

const GeneralSearchSuggestion = ({value} : Props) => {
    return (
        <article className="w-full flex items-center px-6 py-4 space-x-2 group-hover:bg-neutral-950 hover:bg-neutral-950 duration-100">
            <div className="w-8 h-8 rounded-full overflow-hidden grid place-content-center font-semibold text-xl">
                <Search className="size-5" />
            </div>
            <h1>
                {value}
            </h1>
        </article>
    )
}

export default GeneralSearchSuggestion;