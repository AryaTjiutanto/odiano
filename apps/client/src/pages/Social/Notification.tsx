import NotificationContainer from "../../components/notification/NotificationContainer";

const Notification = () => {
    return (
        <>
            <title>
                Notification - Odiano
            </title>

            <div className="main-section-padding-top">
                <section className="flex items-center justify-between">
                    <h1 className="font-bold text-2xl">
                        Notifications
                    </h1>
                    <button className="text-sky-500 hover:text-sky-600 duration-100 text-sm cursor-pointer">
                        Read all
                    </button>
                </section>
                <section className="mt-4">
                    <NotificationContainer />
                </section>
            </div>
        </>
    )
}

export default Notification;