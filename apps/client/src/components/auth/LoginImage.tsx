import { useEffect, useRef } from "react";

import screen1 from "../../assets/img/login/screen-1.svg";
import screen2 from "../../assets/img/login/screen-2.svg";
import screen3 from "../../assets/img/login/screen-3.svg";
import cameraEmoticon from "../../assets/img/login/camera-emoticon.svg";
import commentEmoticon from "../../assets/img/login/comment-emoticon.svg";
import likeEmoticon from "../../assets/img/login/like-emoticon.svg";

const LoginImage = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 30;
            const y = (e.clientY / innerHeight - 0.5) * 30;

            const layers = containerRef.current.querySelectorAll<HTMLElement>(".layer");

            layers.forEach((layer) => {
                const depth = parseFloat(layer.dataset.depth || "0.2");
                layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div
                ref={containerRef}
                className="relative w-[500px] h-[500px]"
            >
                <img
                    src={screen3}
                    data-depth="0.1"
                    className="layer absolute w-[450px] top-10 left-24 rounded-3xl shadow-2xl"
                />

                <img
                    src={screen2}
                    data-depth="0.4"
                    className="layer absolute w-[180px] left-0 top-28 rounded-2xl shadow-xl"
                />

                <img
                    src={screen1}
                    data-depth="0.6"
                    className="layer absolute w-[180px] top-36 left-28 rounded-2xl shadow-xl"
                />

                <img
                    src={cameraEmoticon}
                    data-depth="0.9"
                    className="layer absolute w-20 top-0 left-0"
                />

                <img
                    src={likeEmoticon}
                    data-depth="1.2"
                    className="layer absolute w-20 right-0 top-32"
                />

                <img
                    src={commentEmoticon}
                    data-depth="1.5"
                    className="layer absolute w-20 bottom-0 right-20"
                />
            </div>
        </div>
    );
};

export default LoginImage;