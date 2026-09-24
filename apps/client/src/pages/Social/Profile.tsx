import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { type UserProfileDTO } from "@odiano/shared";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { getUserProfile } from "../../services/user.service";
import { userKeys } from "../../queries/userKeys";
import { useUserFollowList } from "../../providers/UserFollowListProvider";
import { lazy, Suspense } from "react";
import ModalSuspenseFallback from "../../components/modal/SuspenseFallback";
import ProfileContent from "../../components/profile/ProfileContent";
import ProfileSkeletonLoading from "../../components/profile/ProfileSkeletonLoading";
import ProfileError from "../../components/profile/ProfileError";
import SEO from "../../components/seo/SEO";

const UserFollowListModal = lazy(() => import("../../components/modal/UserFollowListModal"))

const Profile = () => {
    const userFollowList = useUserFollowList();
    const { username } = useParams();

    // get user data
    const profileQueryKey = userKeys.profile(username);
    const profileQuery = useQuery({
        queryFn: async (): Promise<UserProfileDTO> => await getUserProfile(username!),
        enabled: !!username,
        queryKey: profileQueryKey,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
    });;

    const title = profileQuery.data ? `${profileQuery.data.name} (@${profileQuery.data.username})` : `@${username}`;

    return (
        <>
            <SEO title={title}/>

            {
                userFollowList.isModalOpen &&
                <Suspense fallback={<ModalSuspenseFallback />}>
                    <UserFollowListModal />
                </Suspense>
            }

            {
                profileQuery.isPending &&
                <ProfileSkeletonLoading />
            }
            {
                profileQuery.isError &&
                <ProfileError queryError={profileQuery.error} />
            } 
            {
                (profileQuery.data && username) &&
                <ProfileContent queryData={profileQuery.data} targetUsername={username} />
            }

        </>
    )
}

export default Profile;