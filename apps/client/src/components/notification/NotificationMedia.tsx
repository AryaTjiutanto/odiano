import { ALLOWED_MEDIA_TYPES, MEDIA_ASPECT_RATIO, type AllowedMediaTypes, type MediaAspectRatio } from "@odiano/shared";

type Props = {
    mediaType : AllowedMediaTypes | undefined,
    mediaUrl : string | undefined,
    mediaAspectRatio : MediaAspectRatio | undefined,
}

const NotificationMedia = ({mediaType, mediaUrl, mediaAspectRatio = MEDIA_ASPECT_RATIO["original"]} : Props) => {
    if(!mediaType || !mediaUrl) return null;
    
    return (
        <div className="max-h-24 max-w-16 rounded-md overflow-hidden">
            {
                mediaType === ALLOWED_MEDIA_TYPES.IMAGE &&
                <img src={mediaUrl} className="w-full" style={{ aspectRatio: mediaAspectRatio }} />
            }
            {
                mediaType === ALLOWED_MEDIA_TYPES.VIDEO &&
                <video src={mediaUrl} className="w-full" controlsList="nodownload"/>
            }
        </div>
    )
}

export default NotificationMedia;