import { useNavigate } from "react-router-dom";

const PostContent = ({ content }: { content: string }) => {
    const navigate = useNavigate();
    const parts = content.split(/(#[\p{L}\p{N}_]+)/gu);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, value : string) => {
        e.stopPropagation();

        navigate(`/search?${new URLSearchParams({q : value})}`);
    };

    return (
        <div className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.startsWith("#")) {
                    return (
                        <button key={index} className="text-sky-500 cursor-pointer hover:text-sky-400 duration-100" onClick={(e) => handleClick(e, part)}>
                            {part}
                        </button>
                    );
                }
                
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};

export default PostContent;