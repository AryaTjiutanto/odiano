import {OTPInput} from "input-otp";
import CustomOTPInputSlot from "./CustomOTPInputSlot";
import type React from "react";

type Props = {
  value : string,
  setValue : React.Dispatch<React.SetStateAction<string>>
}

const CustomOTPInput = ({value, setValue} : Props) => {
    return (
        <OTPInput
            value={value}
            onChange={setValue}
            inputMode="numeric"
            maxLength={6}
            containerClassName="group flex items-center has-[:disabled]:opacity-30"
            render={({ slots }) => (
                <>
                    <div className="flex space-x-2">
                        {slots.slice(0, 6).map((slot, idx) => (
                            <CustomOTPInputSlot key={idx} {...slot} />
                        ))}
                    </div>
                </>
            )}
        />
    )
}

export default CustomOTPInput