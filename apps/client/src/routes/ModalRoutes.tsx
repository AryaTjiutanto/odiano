import { Route, Routes, useNavigate } from "react-router-dom";

const ModalRoutes = () => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path='/:username/post/:postPublicId' element={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm grid place-content-center">
                <button className="px-10 py-4 bg-white" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>} />
        </Routes>
    )
}

export default ModalRoutes;