import { useQueryClient } from "@tanstack/react-query";

const useSetQueryDataHandler = () => {
    const queryClient = useQueryClient();

    return function <T>(key: (string | undefined)[], fn: (oldData: T) => T | undefined) {
        queryClient.setQueryData(
            key,
            (oldData: T | undefined) => {
                if(!oldData) return oldData;

                return fn(oldData);
            }
        )
    }
}

export default useSetQueryDataHandler;