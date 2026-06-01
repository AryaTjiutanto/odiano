import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <button className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-neutral-900 rounded-full duration-100" onClick={handleGoBack}>
            <ArrowLeft />
        </button>
    )
}

export default GoBackButton;