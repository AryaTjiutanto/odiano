import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../hooks/useRedux";
import { lazy, Suspense, useEffect } from "react";
import { intitializeAuth } from "../features/auth/auth.thunk";
import { Toaster } from "react-hot-toast";
import ConfirmationModal from "../components/modal/ConfirmationModal";
import { useConfirmationModal } from "../providers/ConfirmationModalProvider";
import { useImageEditor } from "../providers/ImageEditorProvider";

const ImageEditor = lazy(() => import("../components/editor/ImageEditor"));

const AppLayout = () => {
    const confirmationModal = useConfirmationModal();
    const imageEditor = useImageEditor();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(intitializeAuth());
    }, [dispatch])

    return (
        <>
            {/* head */}
            <meta
                name="keywords"
                content="social media, odiano, community, posts, friends"
            />
            <meta
                name="author"
                content="Arya Tjiutanto"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />

            {/* body */}
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            
            <div className="w-full max-w-480 min-h-screen bg-black text-neutral-100">
                {/* confirmation modal */}
                {
                    confirmationModal.isOpen &&
                    <ConfirmationModal cancelButtonText={confirmationModal.cancelButtonText} confirmButtonText={confirmationModal.confirmButtonText} description={confirmationModal.description} handleCancel={confirmationModal.handleCancel} handleConfirm={confirmationModal.handleConfirm} title={confirmationModal.title}/>
                }
                {/* image editor */}
                {
                    imageEditor.isOpen &&
                    <Suspense fallback={<div className="w-screen h-screen fixed bg-black/80 top-0 left-0 z-20"></div>}>
                        <ImageEditor editData={imageEditor.editData} handleComplete={imageEditor.handleComplete} handleClose={imageEditor.close} imageBlob={imageEditor.imageBlob} options={imageEditor.options}/>
                    </Suspense>
                }

                {/* content */}
                <Outlet />
            </div>
        </>
    )
}

export default AppLayout;