import { useEffect, useRef } from "react";
import DotsLoader from "../loader/DotsLoader";
import { useAppSelector } from "../../hooks/useRedux";
import { Link } from "react-router-dom";

type Props = {
    fetchNextPage: () => void,
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    textForGuest? : string,
}

const InfiniteScrollSentinel = ({ fetchNextPage, hasNextPage, isFetchingNextPage, textForGuest = "to view more content" }: Props) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const sentinel = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0];

            if (!isFetchingNextPage && hasNextPage && entry.isIntersecting) {
                await fetchNextPage();
            }
        }, {
            rootMargin: "20px",
            threshold: 0,
        })

        if (sentinel.current) {
            observer.observe(sentinel.current);
        }

        return () => {
            if (sentinel.current) {
                observer.unobserve(sentinel.current);
            }
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, isAuthenticated]);


    if(!hasNextPage) return <></>;

    if (!isAuthenticated) {
        return (
            <div className="w-full py-4 border-y border-neutral-800 text-center">
                <h1>
                    <Link to="/signin" className="text-sky-500 underline hover:text-sky-400 duration-100">
                        Sign in
                    </Link>{" "}
                    or {" "}
                    <Link to="/signup" className="text-sky-500 underline hover:text-sky-400 duration-100">
                        Create an account
                    </Link>{" "}
                    {textForGuest}
                </h1>
            </div>
        )
    } else {
        return (
            <div className="w-full h-0" ref={sentinel}>
                <div className="w-full h-full flex items-center justify-center">
                    {
                        isFetchingNextPage &&
                        <DotsLoader />
                    }
                </div>
            </div>
        )
    }
}

export default InfiniteScrollSentinel;