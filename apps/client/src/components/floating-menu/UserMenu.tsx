import { EllipsisVertical, Flag, Link2 } from "lucide-react";
import FloatingMenu from "./FloatingMenu";
import MenuItem from "./MenuItem";
import { useAppSelector } from "../../hooks/useRedux";
import { notify } from "../../helpers/notification/notify.helper";
import { REPORT_TYPE } from "@odiano/shared";
import { useReportForm } from "../../providers/ReportFormProvider";

type Props = {
    userId : string | undefined,
    username : string | undefined,
}

const UserMenu = ({userId, username} : Props) => {
    const currentUser = useAppSelector(state => state.auth.user);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const reportForm = useReportForm();

    if (!isAuthenticated || !currentUser || !userId || !username) return;

    // copy link handler
    const copyLinkHandler = () => {
        const url = `${window.location.origin}/profile/${username}`;
        navigator.clipboard.writeText(url);

        notify.success({
            title: "Link copied",
            description: url,
        });
    }

    // report handler 
    const reportHandler = async () => {
        reportForm.open(userId, REPORT_TYPE.USER);
    }

    return (
        <>
            <FloatingMenu trigger={
                <button className="w-11 h-11 grid place-content-center duration-100 border border-white rounded-lg hover:bg-white hover:text-neutral-900 cursor-pointer">
                    <EllipsisVertical />
                </button>
            }>
                {
                    userId !== currentUser.id &&
                    <MenuItem handler={reportHandler}>
                        <div className="w-full h-full flex items-center space-x-3 hover:text-rose-500 duration-100">
                            <Flag />
                            <span>
                                Report
                            </span>
                        </div>
                    </MenuItem>
                }
                <MenuItem handler={copyLinkHandler}>
                    <div className="w-full h-full flex items-center space-x-3 hover:text-sky-500 duration-100">
                        <Link2 />
                        <span>
                            Copy link
                        </span>
                    </div>
                </MenuItem>
            </FloatingMenu>
        </>
    )
}

export default UserMenu;