const PageLoader = ({visible} : {visible : boolean}) => {
    return (
        <div className={`w-full h-screen bg-neutral-950 duration-150 text-white ${visible ? "opacity-100" : "opacity-0"}`}>
            Loading...
        </div>
    )
}

export default PageLoader;