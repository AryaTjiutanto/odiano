const DotsLoader = () => {
    return (
        <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay : "0.2s" }}></span>
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay : "0.3s" }}></span>
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay : "0.5s" }}></span>
        </div>
    )
}

export default DotsLoader;