import { Bookmark, EllipsisVertical, Heart, MessageCircle } from "lucide-react";

const Post = () => {
    return (
        <article className="w-full p-7 rounded-lg bg-neutral-900">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-10 aspect-square rounded-full bg-neutral-800"></div>
                    <div>
                        <div className="flex items-center space-x-2 text-xs">
                            <h1 className="text-neutral-100 font-semibold">Name</h1>
                            <h2 className="text-neutral-500">@username</h2>
                        </div>
                        <h3 className="text-[11px] text-neutral-500">
                            7 days ago
                        </h3>
                    </div>
                </div>
                <EllipsisVertical className="w-4" />
            </div>
            <p className="text-sm mt-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quasi cum reprehenderit. Libero, voluptatibus ducimus!

                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quasi cum reprehenderit. Libero, voluptatibus ducimus!
            </p>
            <div className="mt-8 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4" />
                        <span>
                            0
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Heart className="w-4" />
                        <span>
                            0
                        </span>
                    </div>
                </div>
                <button>
                    <Bookmark className="w-4"/>
                </button>
            </div>
        </article>
    )
}

export default Post;