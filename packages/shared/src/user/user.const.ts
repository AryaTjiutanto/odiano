export const PASSWORD_LENGTH = {
    MIN: 8,
    MAX: 50,
} as const;

export const USERNAME_LENGTH = {
    MIN: 1,
    MAX: 20
}

export const NAME_LENGTH = {
    MIN: 1,
    MAX: 20,
}

export const BIO_LENGTH = {
    MIN: 0,
    MAX: 150,
}

export const MAX_PROFILE_IMAGE_SIZE = 15 * 1024 * 1024;
export const ALLOWED_PROFILE_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];