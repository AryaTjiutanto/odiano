import { MEDIA_ASPECT_RATIO, type PostMedia as PostMediaType } from "@odiano/shared";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    media: PostMediaType[] | null;
};

const PostMedia = ({ media }: Props) => {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    if (!media || media.length === 0) return null;

    if (media.length === 1) {
        const item = media[0];

        return (
            <div className="w-full min-w-0 overflow-hidden">
                <div
                    className="min-w-[30%] max-w-full max-h-140 overflow-hidden rounded-xl"
                    style={{
                        ...(item.aspectRatio !== MEDIA_ASPECT_RATIO["original"] && { aspectRatio: item.aspectRatio }),
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {item.type === "image" && (
                        <img
                            src={item.source.url}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    )}

                    {item.type === "video" && (
                        <video
                            src={item.source.url}
                            className="h-full w-full object-cover"
                            controls
                            controlsList="nodownload nopictureinpicture"
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    )}
                </div>
            </div>
        );
    }

    const updateSwiperState = (swiper: SwiperType) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (

        <div className="mt-8 w-full min-w-0 overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView="auto"
                spaceBetween={10}
                navigation={{
                    prevEl: prevButtonRef.current,
                    nextEl: nextButtonRef.current
                }}
                pagination={{
                    clickable: true,
                }}
                className="post-media-swiper"
                freeMode={true}
                onReachBeginning={updateSwiperState}
                onReachEnd={updateSwiperState}

                style={{
                    "--swiper-pagination-color": "oklch(68.5% 0.169 237.323)",
                    "--swiper-pagination-bullet-inactive-color": "oklch(58.8% 0.158 241.966)",
                    "--swiper-pagination-bullet-inactive-opacity": "1",
                    "--swiper-pagination-bullet-size": "16px",
                    "--swiper-pagination-bullet-horizontal-gap": "6px"
                } as CSSProperties}
            >
                {media.map((item, index) => (
                    <SwiperSlide key={index} style={{
                        width: "auto"
                    }}>
                        <div
                            className="relative h-70 md:h-95 overflow-hidden rounded-xl"
                            style={{
                                aspectRatio: item.aspectRatio,
                            }}
                        >
                            {item.type === "image" && (
                                <img
                                    src={item.source.url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            )}

                            {item.type === "video" && (
                                <video
                                    src={item.source.url}
                                    className="h-full w-full object-cover"
                                    controls
                                    controlsList="nodownload noplaybackrate"
                                    disablePictureInPicture
                                />
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* navigation */}
            <button ref={prevButtonRef} className={`absolute top-0 bottom-0 my-auto left-2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 duration-100 cursor-pointer text-white text-sm ${isBeginning ? "opacity-0" : "opacity-100"}`} onClick={(e) => e.stopPropagation()}>
                <ChevronLeft />
            </button>
            <button ref={nextButtonRef} className={`absolute top-0 bottom-0 my-auto right-2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 duration-100 cursor-pointer text-white text-sm ${isEnd ? "opacity-0" : "opacity-100"}`} onClick={(e) => e.stopPropagation()}>
                <ChevronRight />
            </button>
        </div>
    );
};

export default PostMedia;