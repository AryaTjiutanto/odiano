type Props = {
    size? : "reguler" | "small" | "large",
}

const DotsLoader = ({size = "reguler"} : Props) => {
    let sizeClassname : string;

    switch (size) {
        case "small":
            sizeClassname = "w-1 h-1";
            break;
        case "large":
            sizeClassname = "w-5 h-5";
            break;
        default:
            sizeClassname = "w-2 h-2";
            break;
    }

    return (
        <div className="flex items-center space-x-1">
            <span className={`${sizeClassname} rounded-full bg-current animate-bounce`} style={{ animationDelay : "0.2s" }}></span>
            <span className={`${sizeClassname} rounded-full bg-current animate-bounce`} style={{ animationDelay : "0.3s" }}></span>
            <span className={`${sizeClassname} rounded-full bg-current animate-bounce`} style={{ animationDelay : "0.5s" }}></span>
        </div>
    )
}

export default DotsLoader;