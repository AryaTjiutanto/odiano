import { Plus } from "lucide-react";
import { useState } from "react";

type Story = {
    owner: {
        userId: string,
        username: string,
    },
    gradientColor: string,
}

const gradientColors = [
    "bg-linear-to-r from-yellow-400 via-pink-500 to-purple-600",
    "bg-linear-to-r from-orange-400 via-rose-500 to-fuchsia-600",
    "bg-linear-to-r from-pink-500 via-red-500 to-yellow-500",
    "bg-linear-to-r from-fuchsia-500 via-pink-500 to-orange-400",
    "bg-linear-to-r from-rose-500 via-pink-500 to-purple-500",
    "bg-linear-to-r from-orange-500 via-pink-500 to-purple-600",
    "bg-linear-to-r from-red-500 via-orange-400 to-yellow-400",
    "bg-linear-to-r from-pink-600 via-rose-500 to-orange-400",
    "bg-linear-to-r from-purple-500 via-fuchsia-500 to-pink-500",
    "bg-linear-to-r from-yellow-300 via-orange-400 to-pink-500",
];


const StoryList = () => {
    const [stories] = useState<Story[] | null>(() => [
        {
            gradientColor: gradientColors[Math.floor(Math.random() * gradientColors.length)],
            owner: {
                userId: "190",
                username: "Test",
            }
        },
        {
            gradientColor: gradientColors[Math.floor(Math.random() * gradientColors.length)],
            owner: {
                userId: "190",
                username: "Test 2",
            }
        },
        {
            gradientColor: gradientColors[Math.floor(Math.random() * gradientColors.length)],
            owner: {
                userId: "190",
                username: "Test 3",
            }
        }
    ]);

    // const maxStories = window.innerWidth >= 1980 ? 7 : window.innerWidth >= 1980 ? 6 : 3;

    return (
        <div className="">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Story</h1>
                <button className="text-xs text-neutral-300">
                    View all
                </button>
            </div>
            <div className="w-full grid grid-cols-8 gap-5 mt-6">
                <div className="w-full flex flex-col items-center">
                    <div className="w-full aspect-square rounded-full bg-neutral-900 grid place-content-center text-neutral-600">
                        <Plus />
                    </div>
                    <span className="text-[11px] text-neutral-300 mt-2">
                        Add story
                    </span>
                </div>
                {
                    stories &&
                    stories.map((story) => (
                        <div className="w-full flex flex-col items-center">
                            <div className={`w-full aspect-square rounded-full ${story.gradientColor} grid place-content-center relative`}>
                                <div className="w-[95%] aspect-square rounded-full bg-neutral-900 grid place-content-center text-neutral-600 absolute top-0 left-0 right-0 bottom-0 m-auto">
                                </div>
                            </div>
                            <span className="text-[11px] text-neutral-300 mt-2">
                                {story.owner.username}
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default StoryList;