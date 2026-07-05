import { useEffect, useState } from "react";

const useDebounce = <T> (value : T, delay : number = 300) => {
    const [debounceValue, setDebounceValue] = useState<T>();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceValue(value);
        }, delay)

        return () => {
            clearTimeout(timeout);
        }
    }, [value, delay]);

    return debounceValue;
}

export default useDebounce;