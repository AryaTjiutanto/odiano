export type UserProfileImageDTO = {
    url: string,
    publicId: string,
}

export type PostUserDTO = {
    id : string,
    name : string | null,
    username : string | null,
    slug : string | null,
    profileImage : UserProfileImageDTO | null
}

export type CurrentUserDTO = {
    id: string,
    email: string,
    username: string,
    name: string,
    slug: string,
    profileImage: UserProfileImageDTO,
    isOnboarded: boolean,
}