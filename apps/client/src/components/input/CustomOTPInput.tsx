import {OTPInput} from "input-otp";
import CustomOTPInputSlot from "./CustomOTPInputSlot";


type Props = {
  value : string,
  setValue : (value : string) => void,
  isLoading : boolean
}

const CustomOTPInput = ({value, setValue, isLoading} : Props) => {
    return (
        <OTPInput
            value={value}
            onChange={setValue}
            inputMode="numeric"
            maxLength={6}
            disabled={isLoading}
            containerClassName="group flex items-center has-[:disabled]:opacity-60"
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