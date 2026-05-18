import { useEffect, useRef, useState } from "react"
import PillSwitch from "../input/PillSwitch";

type Props = {
    setShowCreatePostFormSection: React.Dispatch<React.SetStateAction<boolean>>
}

const PostFormSection = ({setShowCreatePostFormSection}: Props) => {
    // setting
    const [hideLikeAndViewCount, setHideLikeAndViewCount] = useState<boolean>(false);
    const [turnOffCommenting, setTurnOffComenting] = useState<boolean>(false);

    // content input
    const contentInput = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        contentInput?.current?.focus();
    }, [])

    return (
        <div className="w-screen h-screen fixed bg-neutral-950/80 top-0 left-0 z-20 flex justify-center py-32">
            {/* content */}
            <div className="w-[650px] rounded-3xl bg-neutral-900 p-10 h-fit relative z-22">
                <div className="w-full h-24">
                    <label className="w-full h-full rounded-xl border border-neutral-400 border-dashed grid place-content-center text-xs text-neutral-300 cursor-pointer" htmlFor="media-input">
                        <span>Drag and drop photos or videos here, or click to select files. (optional)</span>
                    </label>
                    <input type="file" className="hidden" id="media-input" accept="image/*,video/*"/>
                </div>
                <textarea className="mt-4 w-full h-40 border border-neutral-600 rounded-xl py-4 px-5 text-neutral-200 default-input-text-behaviour" placeholder="What's on your mind?" ref={contentInput}></textarea>
                <div className="flex flex-col space-y-2 mt-3">
                    <div className="flex items-center space-x-10">
                        <p className="h-fit">
                            Hide Like and view count on this post?
                        </p>
                        <PillSwitch checked={hideLikeAndViewCount} onToggle={() => setHideLikeAndViewCount(!hideLikeAndViewCount)} />
                    </div>
                    <div className="flex items-center space-x-10">
                        <p className="h-fit">
                            Turn off commenting
                        </p>
                        <PillSwitch checked={turnOffCommenting} onToggle={() => setTurnOffComenting(!turnOffCommenting)} />
                    </div>
                </div>
                <div className="mt-10 flex items-center text-sm space-x-3">
                    <button className="px-11 h-11 border border-white bg-white text-neutral-800 hover:bg-transparent hover:text-neutral-100 duration-100 cursor-pointer rounded">
                        Post
                    </button>
                    <button onClick={() => setShowCreatePostFormSection(false)} className="px-8 h-11 border border-white hover:bg-white hover:text-neutral-800 duration-100 cursor-pointer rounded">
                        Cancel
                    </button>
                </div>
            </div>

            {/* background to close section */}
            <div className="w-full h-full fixed top-0 left-0" onClick={() => setShowCreatePostFormSection(false)}></div>
        </div>
    )
}

export default PostFormSection;