export type UserProfileImageDTO = {
    url: string,
    publicId: string,
}

export type CurrentUserDTO = {
    id: string,
    email: string,
    username: string | null,
    name: string | null,
    slug: string | null,
    profileImage: string,
    isOnboarded: boolean,
}