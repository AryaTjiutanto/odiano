import DotsLoader from "../loader/DotsLoader";

const ModalSuspenseFallback = () => {
    return (
        <section className="w-full h-full fixed top-0 left-0 grid place-content-center z-25">
            <div className="w-full h-full bg-black/50 absolute z-25"></div>

            <div className="w-[500px] z-26 rounded-lg bg-neutral-900 h-72 grid place-content-center text-neutral-400">
                <DotsLoader/>
            </div>
        </section>
    )
}

export default ModalSuspenseFallback;