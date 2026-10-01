import NotFound from "../../components/error/NotFound";

const NotFoundPage = () => {
    return (
        <>
            {/* head */}
            <title>Not Found - Odiano</title>
            <meta
                name="description"
                content="odiano with friends, share posts, and explore communities."
            />

            <div className="fixed top-0 left-0 w-screen h-screen z-100 bg-black">
                <NotFound/>
            </div>
        </>
    )
}

export default NotFoundPage;