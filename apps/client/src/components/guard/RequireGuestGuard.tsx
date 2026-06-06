import useRequireGuest from "../../guard/useRequireGuest.guard";
import GuardExecuter from "./GuardExecuter";

const RequireGuestGuard = () => {
    const result = useRequireGuest();

    return <GuardExecuter result={result}/>
}

export default RequireGuestGuard;