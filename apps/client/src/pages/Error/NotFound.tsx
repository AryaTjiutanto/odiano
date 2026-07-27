import ErrorState from "../../components/common/ErrorState"

const NotFound = () => {
    const description = "The page you're looking for doesn't exist or may have been moved. Please check the URL or return to the homepage.";

    return (
        <div className="w-full h-full fixed left-0 top-0 grid place-content-center">
            <div className="max-w-160">
                <ErrorState title="Page Not Found" code="404" fontSize="large" description={description} />
            </div>
        </div>
    )
}

export default NotFound;