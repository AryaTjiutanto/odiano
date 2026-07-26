import type { SlotProps } from "input-otp"

const CustomOTPInputSlot = (props: SlotProps) => {
    return (
        <div
            className={
                `relative w-11 sm:w-13 h-13 text-xl flex items-center justify-center transition-all duration-150 border rounded-md group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20 outline 
                ${props.isActive ?'outline-2 outline-accent-foreground' : 'outline-0 outline-accent-foreground/20'}
            `}
        >
            <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
                {props.char ?? props.placeholderChar}
            </div>
        </div>
    )
}

export default CustomOTPInputSlot