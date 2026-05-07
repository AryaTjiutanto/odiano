import useRequireAuth from "../../guard/requireAuth.guard";
import LoadingGuard from "./LoadingGuard";

const RequireAuthGuard = () => {
    const result = useRequireAuth();

    return (
        <LoadingGuard result={result}/>
    )
}

export default RequireAuthGuard;