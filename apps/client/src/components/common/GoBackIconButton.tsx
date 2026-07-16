import { ArrowLeft } from "lucide-react";
import useGoBack from "../../hooks/useGoBack";

const GoBackIconButton = () => {
    const handleGoBack = useGoBack();

    return (
        <button type="button" className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-sky-500/20 hover:text-sky-500 rounded-full duration-100" onClick={handleGoBack}>
            <ArrowLeft />
        </button>
    )
}

export default GoBackIconButton;