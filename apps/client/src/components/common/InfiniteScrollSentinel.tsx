import { useEffect, useRef } from "react";
import DotsLoader from "../loader/DotsLoader";

type Props = {
    fetchNextPage : () => void,
    hasNextPage : boolean,
    isFetchingNextPage : boolean,
}

const InfiniteScrollSentinel = ({fetchNextPage, hasNextPage, isFetchingNextPage} : Props) => {
    const sentinel = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0];

            if(!isFetchingNextPage && hasNextPage && entry.isIntersecting) {
                await fetchNextPage();
            }
        }, {
            rootMargin : "20px",
            threshold : 0,
        })

        if(sentinel.current) {
            observer.observe(sentinel.current);
        }

        return () => {
            if(sentinel.current) {
                observer.unobserve(sentinel.current);
            }
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <div className="w-full h-0" ref={sentinel}>
            <div className="w-full h-full flex items-center justify-center">
                {
                    isFetchingNextPage &&
                    <DotsLoader/>
                }
            </div>
        </div>    
    )
}

export default InfiniteScrollSentinel;