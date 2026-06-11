export type UserProfileImageDTO = {
    url: string,
    publicId: string,
}

export type PostUserDTO = {
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
    name : string,
    profileImage : UserProfileImageDTO,
    bio : string,
    createdAt : Date,
}