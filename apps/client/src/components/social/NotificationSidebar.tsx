import type { InfiniteQuery, SuccessResponseData } from "@connect/shared";
import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import type React from "react";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { api } from "../../libs/api";

type Props = {
    setIsNotificatoinSidebarVisible : React.Dispatch<React.SetStateAction<boolean>>
}

const NotificationSidebar = ({setIsNotificatoinSidebarVisible} : Props) => {
    const getNotifications = async ({pageParam} : QueryFunctionContext) : Promise<InfiniteQuery<string>> => {
        const response = await api.get<SuccessResponseData<InfiniteQuery<string>>>(`/notification`, {
            params : {
                cursor : pageParam
            }
        });

        if(!response.data.data) {
            throw new Error("Notification is empty");
        }

        return response.data.data;
    }

    const notificationQuery = useInfiniteQuery({
        queryFn : getNotifications,
        queryKey : ['notification'],
        staleTime : 30 * 1000,
        gcTime : DEFAULT_GC_TIME,
        initialPageParam : null,
        getNextPageParam : (lastPage : InfiniteQuery<string>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
    })

    return (
        <div className="w-full h-full bg-neutral-950 z-20">
            <div className="flex items-center space-x-6">
                <button className="w-8 aspect-square rounded-full grid place-content-center cursor-pointer hover:bg-sky-500/20 hover:text-sky-500 duration-100" onClick={() => setIsNotificatoinSidebarVisible(false)}>
                    <ArrowLeft className="w-5" />
                </button>
                <h1 className="font-semibold text-xl">
                    Notifications
                </h1>
            </div>
            <div className="mt-8">
                {/* like notification */}
                <article className="w-full flex items-center space-x-3">
                    <div className="h-12 aspect-square rounded-full bg-neutral-600">
                    </div>

                    <div className="flex-1 w-full flex space-x-2">
                        <p>
                            <b className="font-semibold mr-2">
                                @Test01_
                            </b>
                            Liked your post
                        </p>
                    </div>
                </article>
            </div>
        </div>
    )
}

export default NotificationSidebar;