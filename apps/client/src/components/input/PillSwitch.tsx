type Props = {
    checked: boolean,
    onToggle: () => void
}

const PillSwitch = ({ checked, onToggle }: Props) => {
    return (
        <button type="button" onClick={onToggle} className={`w-9 h-4.5 rounded-full relative cursor-pointer ${checked ? "bg-sky-500" : "bg-neutral-700"}`}>
            <div className={`h-[70%] aspect-square rounded-full absolute ${checked ? "left-4.75 bg-neutral-100" : "left-1 bg-neutral-500 "} top-0 bottom-0 my-auto duration-200`}></div>
        </button>
    )
}

export default PillSwitch;