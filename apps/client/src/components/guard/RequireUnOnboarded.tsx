import useRequireUnOnboarded from "../../guard/requireUnOnboarded.guard";
import LoadingGuard from "./LoadingGuard";

const RequireUnOnboarded = () => {
    const result = useRequireUnOnboarded();
    return (
        <LoadingGuard result={result} />
    )
}

export default RequireUnOnboarded;