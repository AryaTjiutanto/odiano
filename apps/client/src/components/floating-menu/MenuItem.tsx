type Props = {
    handler : (data? : any) => void,
    children : React.ReactNode,
}

const MenuItem = ({handler, children} : Props) => {
    return (
        <button onClick={handler} className="w-full px-5 h-11 flex items-center justify-between cursor-pointer hover:bg-neutral-900 duration-100">
            {children}
        </button>
    )
}

export default MenuItem;