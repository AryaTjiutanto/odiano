export type UserProfileImageDTO = {
    url: string,
    publicId: string,
}

export type UserCoverImageDTO = {
    url : string,
    publicId : string,
}

export type UserSummaryDTO = {
    id : string,
    name : string | null,
    username : string | null,
    profileImage : UserProfileImageDTO | null
}

export type CurrentUserDTO = {
    id: string,
    email: string,
    username: string | null,
    name: string | null,
    profileImage: UserProfileImageDTO | null,
    isOnboarded: boolean,
}

export type UserProfileDTO = {
    id : string,
    username : string,
    bio : string,
    name : string,
    createdAt : Date,
    coverImage : UserCoverImageDTO | null,
    profileImage : UserProfileImageDTO | null,
    followerCount : number,
    followingCount : number,
    isFollowing? : boolean,
}