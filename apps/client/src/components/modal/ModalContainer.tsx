type Props = {
    closeModalHandler? : () => void,
    children : React.ReactNode,
    width? : "default" | "fit",
}

const ModalContainer = ({closeModalHandler = () => {}, children, width = "default"} : Props) => {
    return (
        <section className="fixed grid inset-0 place-content-center z-25">
            <div className="w-full h-full bg-black/50 absolute cursor-pointer" onClick={closeModalHandler}></div>

            <div className={`w-[90%] ${width == "fit" ? "sm:w-fit" : "md:w-[500px]"} h-fit right-0 left-0 top-0 bottom-0 m-auto absolute rounded-lg bg-[#101010]`}>
                {children}
            </div>
        </section>
    )
}

export default ModalContainer;