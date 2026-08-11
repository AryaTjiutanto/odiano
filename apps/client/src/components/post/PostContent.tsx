const PostContent = ({ content }: { content: string }) => {
    const parts = content.split(/(#[\p{L}\p{N}_]+)/gu);

    return (
        <div className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.startsWith("#")) {
                    return (
                        <span key={index} className="text-sky-500 cursor-pointer">
                            {part}
                        </span>
                    );
                }
                
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};

export default PostContent;