type Props = {
    handleConfirm : () => void,
    handleCancel : () => void,
    title : string,
    description : string,
    confirmButtonText : string,
    cancelButtonText : string,
}

const ConfirmationModal = ({handleConfirm, handleCancel, title, description, confirmButtonText, cancelButtonText} : Props) => {
    return (
        <section className="w-screen h-screen fixed top-0 left-0 bg-black/50 z-50 grid place-content-center">
            <div className="w-95 p-7 bg-neutral-950 rounded-lg">
                <h1 className="text-xl font-bold">
                    {title}
                </h1>
                <h2 className="text-base mt-2 text-neutral-500">
                    {description}
                </h2>
                <div className="grid grid-cols-2 items-center gap-3 mt-4">
                    <button className="w-full h-12 bg-transparent border border-neutral-400 hover:bg-neutral-100 hover:text-neutral-800 hover:border-neutral-100 duration-100 cursor-pointer text-neutral-100 font-medium rounded-lg" onClick={handleCancel}>
                        {cancelButtonText}
                    </button>
                    <button className="w-full h-12 bg-red-500 hover:bg-rose-500 text-white hover:bg- cursor-pointer font-medium py-2 px-4 rounded-lg" onClick={handleConfirm}>
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ConfirmationModal;