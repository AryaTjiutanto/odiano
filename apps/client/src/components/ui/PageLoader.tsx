const PageLoader = ({visible} : {visible : boolean}) => {
    return (
        <div className={`w-full h-screen bg-neutral-950 duration-150 ${visible ? "opacity-100" : "opacity-0"}`}>
            
        </div>
    )
}

export default PageLoader;