import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { lazy, Suspense, useEffect, useLayoutEffect, type ReactNode } from "react";
import { intitializeAuth } from "../features/auth/auth.thunk";
import { Toaster } from "react-hot-toast";
import ConfirmationModal from "../components/modal/ConfirmationModal";
import { useConfirmationModal } from "../providers/ConfirmationModalProvider";
import { useImageEditor } from "../providers/ImageEditorProvider";
import { getRules } from "@odiano/shared";
import { AbilityProvider } from '@casl/react';
import { createAppAbility } from "../helpers/ability.helper";
import PageLoader from "../components/loader/PageLoader";
import { useLocation } from "react-router-dom";
import { useStackProvider } from "../providers/StackProvider";

const ImageEditor = lazy(() => import("../components/editor/ImageEditor"));

const AppLayout = ({ children }: { children: ReactNode }) => {
    const confirmationModal = useConfirmationModal();
    const imageEditor = useImageEditor();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(state => state.auth.user);
    const location = useLocation();
    const { stack } = useStackProvider();

    useEffect(() => {
        dispatch(intitializeAuth());
    }, [dispatch])

    const ability = createAppAbility(currentUser ? getRules(currentUser.id, currentUser.role) ?? [] : []);

    // handle stack scroll y
    useLayoutEffect(() => {
        const currentStack = stack[stack.length - 1];

        if(currentStack?.location?.pathname != location.pathname) return;

        window.scrollTo(0, currentStack.scrollY);

    }, [location, stack]);

    return (
        <>
            {/* body */}
            <Toaster
                position="top-right"
                reverseOrder={false}
            />

            <AbilityProvider value={ability}>
                <div className="w-full max-w-480 min-h-screen bg-black text-neutral-100">
                    {/* confirmation modal */}
                    {
                        confirmationModal.isOpen &&
                        <ConfirmationModal cancelButtonText={confirmationModal.cancelButtonText} confirmButtonText={confirmationModal.confirmButtonText} description={confirmationModal.description} handleCancel={confirmationModal.handleCancel} handleConfirm={confirmationModal.handleConfirm} title={confirmationModal.title} />
                    }
                    {/* image editor */}
                    {
                        imageEditor.isOpen &&
                        <Suspense fallback={<div className="w-screen h-screen fixed bg-black/80 top-0 left-0 z-20"></div>}>
                            <ImageEditor editData={imageEditor.editData} handleComplete={imageEditor.handleComplete} handleClose={imageEditor.close} imageBlob={imageEditor.imageBlob} options={imageEditor.options} />
                        </Suspense>
                    }

                    {/* content */}
                    <PageLoader>
                        {children}
                    </PageLoader>
                </div>
            </AbilityProvider>
        </>
    )
}

export default AppLayout;