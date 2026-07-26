import { Outlet } from "react-router-dom";
import { PostFormProvider } from "../providers/PostFormProvider";

const CreatePostLayout = () => {
    return (
        <PostFormProvider>
            <Outlet/>
        </PostFormProvider>
    )
}

export default CreatePostLayout;