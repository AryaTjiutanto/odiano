import useRequireUnVerify from "../../guard/useRequireUnVerify.guard";
import GuardExecuter from "./GuardExecuter";

const RequireUnVerify = () => {
    const result = useRequireUnVerify();

    return <GuardExecuter result={result}/>
}

export default RequireUnVerify;