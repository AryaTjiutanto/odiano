import { SquarePen } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import { usePostForm } from "../../providers/PostFormProvider";

const CreatePostFloatingButton = () => {
    const postForm = usePostForm();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    if(!isAuthenticated) return null;

    return (
        <button className="w-14 h-14 rounded-full bg-white fixed bottom-24 right-10 sm:hidden z-20 grid place-content-center text-neutral-800" onClick={postForm.open}>
            <SquarePen className="w-5"/>
        </button>
    )
}

export default CreatePostFloatingButton;