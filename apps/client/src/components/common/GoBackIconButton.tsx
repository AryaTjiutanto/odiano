import { ArrowLeft } from "lucide-react";
import { useStackProvider } from "../../providers/StackProvider";

const GoBackIconButton = () => {
    const {pop} = useStackProvider();

    return (
        <button type="button" className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-sky-500/20 hover:text-sky-500 rounded-full duration-100" onClick={pop}>
            <ArrowLeft />
        </button>
    )
}

export default GoBackIconButton;