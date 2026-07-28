export type UserProfileImageDTO = {
    url: string,
    publicId: string | null,
}

export type UserCoverImageDTO = {
    url : string,
    publicId : string,
}

export type UserSummaryDTO = {
    id : string,
    name : string | null,
    username : string,
    profileImage : UserProfileImageDTO | null,
    isFollowing? : boolean
}

export type CurrentUserDTO = {
    id: string,
    email: string,
    username: string,
    name: string | null,
    profileImage: UserProfileImageDTO | null,
    isOnboarded: boolean,
    dateOfBirth:string | null,
    isEmailVerified: boolean,
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