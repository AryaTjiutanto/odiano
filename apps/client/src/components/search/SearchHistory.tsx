import { type SearchHistoryDTO } from "@connect/shared"
import SearchResult from "./searchResult/SearchResult"
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { searchKeys } from "../../queries/searchKeys";
import { deleteAllSearchHistory, deleteSearchHistory } from "../../services/searchHistory.service";
import { notify } from "../../helpers/notification/notify.helper";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";

type Props = {
    data: SearchHistoryDTO,
}

const SearchHistory = ({ data }: Props) => {
    if(!data.targetData) return null;

    const setQueryDataHandler = useSetQueryDataHandler();

    // delete single history
    const historyMutation = useMutation({
        mutationFn : deleteSearchHistory,

        onMutate : () => setQueryDataHandler<SearchHistoryDTO[]>(searchKeys.history, (oldData) => {
            return [
                ...oldData.filter((old) => old.id !== data.id)
            ]
        }),

        onError : () => setQueryDataHandler<SearchHistoryDTO[]>(searchKeys.history, (oldData) => {
            const newData = [...oldData, data];

            newData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date (a.updatedAt).getTime());

            return newData;
        })
    })

    const deleteSearchHistoryHandler = async () => {
        try {
            await historyMutation.mutateAsync(data.id);
        } catch (err) {
            notify.error({title : "Fail", description : "Something went wrong"});
        }
    }

    return (
        <div className="relative group">
            <SearchResult data={data.targetData} type={data.type} />

            {/* delete button */}
            <button className="absolute top-0 bottom-0 my-auto right-5 w-10 h-10 grid place-content-center rounded-full hover:bg-sky-500/10 hover:text-sky-500 duration-100 cursor-pointer" onClick={deleteSearchHistoryHandler}>
                <X className="size-6"/>
            </button>
        </div>
    )
}

export default SearchHistory;