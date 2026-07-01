import { useEffect } from "react";
import { useAppSelector } from "../hooks/useRedux";
import { socket } from "../libs/socket";

type Props = {
    children : React.ReactNode
}

const SocketProvider = ({children} : Props) => {
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        if(!accessToken) {
            socket.disconnect();
            return;
        }

        socket.auth = {
            token : accessToken
        }
        socket.connect();

        return () => {
            socket.disconnect()
        };
    }, [!!accessToken]);

    return children;
}
 
export default SocketProvider;