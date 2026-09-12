import { type NotificationPostTarget } from "@odiano/shared";
import Profile from "../profile/Profile";
import { toHumanReadableDate } from "../../utils/dateFormater.util";
import NotificationMedia from "../notification/NotificationMedia";

type Props = {
    data: NotificationPostTarget,
}

const ModalPostCard = ({ data }: Props) => {
    return (
        <div className="mt-4 border rounded-xl border-neutral-600 p-3">
            <div className="flex space-x-3">
                <div className="w-12 h-12 rounded-full bg-neutral-800">
                    <Profile data={data.author?.profileImage} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h1 className="font-semibold text-neutral-300">
                                    {data.author?.name}
                                </h1>
                                <h2 className="text-neutral-500">
                                    @{ data.author?.username }
                                </h2>
                            </div>
                            <div className="text-sm text-neutral-500">
                                { data.createdAt ? toHumanReadableDate(data.createdAt) : "-" }
                            </div>
                        </div>
                        <div className="rounded-md bg-neutral-800">
                            {
                                <NotificationMedia mediaType={data.firstMedia?.type} mediaUrl={data.firstMedia?.url} mediaAspectRatio={data.firstMedia?.aspectRatio} />
                            }
                        </div>
                    </div>
                    <p className="mt-1 text-sm text-neutral-400 truncate">
                        { data.content || "" }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ModalPostCard;