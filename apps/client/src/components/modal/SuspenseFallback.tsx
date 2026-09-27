import DotsLoader from "../loader/DotsLoader";
import ModalContainer from "./ModalContainer";

const ModalSuspenseFallback = () => {
    return (
        <ModalContainer>
            <div className="h-72 md:w-[500px] grid place-content-center text-neutral-400">
                <DotsLoader/>
            </div>
        </ModalContainer>
    )
}

export default ModalSuspenseFallback;