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

            <NotFound/>
        </>
    )
}

export default NotFoundPage;