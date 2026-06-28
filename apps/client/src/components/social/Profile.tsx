import type { UserProfileImageDTO } from "@connect/shared";
import { User } from "lucide-react";

type Props = {
    data : UserProfileImageDTO | null | undefined,
}

const Profile = ({data} : Props) => {
    return (
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-zinc-800">
            {
                data ?
                <img src={data.url} className="w-full h-full"/>
                :
                <User className="w-2/5 h-2/5" />
            }
        </div>
    )
}

export default Profile;