import useRequireUnOnboarded from "../../guard/useRequireUnOnboarded.guard";
import GuardExecuter from "./GuardExecuter";

const RequireUnOnboarded = () => {
    const result = useRequireUnOnboarded();

    return <GuardExecuter result={result}/>
}

export default RequireUnOnboarded;