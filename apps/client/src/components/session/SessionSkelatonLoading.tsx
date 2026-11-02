type Props = {
    withButton?: boolean
}

const SessionSkelatonLoading = ({ withButton = true }: Props) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 grid place-content-center rounded-full bg-neutral-800 animate-pulse"></div>
                <div className="space-y-1">
                    <div className="w-32 h-3 rounded bg-neutral-800 animate-pulse"></div>
                    <div className="w-20 h-2 rounded-sm bg-neutral-800 animate-pulse"></div>
                </div>
            </div>
            {
                withButton &&
                <button className="text-xs w-20 h-9 bg-neutral-800 animate-pulse hover:text-white duration-100 cursor-pointer rounded-full"></button>
            }
        </div>
    )
}

export default SessionSkelatonLoading;