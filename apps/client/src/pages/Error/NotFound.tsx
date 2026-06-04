import ErrorState from "../../components/common/ErrorState"

const NotFound = () => {
    const description = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus, ipsam tempore non sint rem a.";

    return (
        <div className="w-full h-full fixed left-0 top-0 grid place-content-center">
            <div className="max-w-160">
                <ErrorState title="Page Not Found" code="404" fontSize="large" description={description}/>
            </div>
        </div>
    )
}

export default NotFound;