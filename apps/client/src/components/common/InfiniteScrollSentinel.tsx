import { useEffect, useRef } from "react";
import DotsLoader from "../loader/DotsLoader";
import { useAppSelector } from "../../hooks/useRedux";
import { Link } from "react-router-dom";
import type { InfiniteQuery } from "@odiano/shared";

type Props<T> = {
    fetchNextPage: () => void,
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    data?: InfiniteQuery<T>,
    textForGuest?: string,
    rootMargin?: number,
    cooldownMode?: boolean,
}

const InfiniteScrollSentinel = <T,>({ fetchNextPage, hasNextPage, isFetchingNextPage, textForGuest = "to view more content", rootMargin = 20, data, cooldownMode = false }: Props<T>) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const sentinel = useRef<HTMLDivElement | null>(null);

    const cooldown = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const observer = new IntersectionObserver(async (entries) => {
            const entry = entries[0];
            if (isFetchingNextPage || !hasNextPage || !entry.isIntersecting) return;

            // cooldown
            const isEmptyDoubleType = (cooldownMode && data?.type == "double" && data.isBottomPostsNull && data.isTopPostsNull) || !data;

            if (cooldown.current) {
                return;
            }

            if (isEmptyDoubleType) {
                cooldown.current = setTimeout(async () => {
                    cooldown.current = null;

                    await fetchNextPage();
                }, 30 * 1000);

                return;
            }

            // fetching
            await fetchNextPage();
        }, {
            rootMargin: `${rootMargin}px`,
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
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, data, isAuthenticated, rootMargin, cooldownMode]);

    if (!hasNextPage) return <></>;

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