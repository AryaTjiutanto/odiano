import useRequireAuth from "../../guard/useRequireAuth.guard";
import GuardExecuter from "./GuardExecuter";

const RequireAuthGuard = () => {
    const result = useRequireAuth();
   
    return <GuardExecuter result={result}/>
}

export default RequireAuthGuard;