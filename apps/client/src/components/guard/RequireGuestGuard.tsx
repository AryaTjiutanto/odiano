import useRequireGuest from "../../guard/requireGuest.guard";
import LoadingGuard from "./LoadingGuard";

const RequireGuestGuard = () => {
    const result = useRequireGuest();
    return (
        <LoadingGuard result={result}/>
    )
}

export default RequireGuestGuard;