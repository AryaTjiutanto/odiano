import { z } from "zod";
import { BIO_LENGTH, NAME_LENGTH, PASSWORD_LENGTH, USERNAME_LENGTH } from "./user.const";

export const createUserSchema = z.object({
    email: z.string()
        .email({ message: "Invalid email format" })
        .max(120, { message: 'Email maximum 120 characters' })
        .trim(),
    password: z.string()
        .min(PASSWORD_LENGTH.MIN, { message: `Password minimum ${PASSWORD_LENGTH.MIN} characters` })
        .max(PASSWORD_LENGTH.MAX, { message: `Password maximum ${PASSWORD_LENGTH.MAX} characters` })
        .trim(),
    dateOfBirth: z.string({message : "Please enter your Date of Birth"})
        .min(1, { message: "Please enter your Date of Birth" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Something went wrong, please try again" })
});

export const createUserProfileSchema = z.object({
    name: z.string()
        .min(NAME_LENGTH.MIN, { message: `Name cannot be empty` })
        .max(NAME_LENGTH.MAX, { message: `Name maximum ${NAME_LENGTH.MAX} characters` })
        .regex(/^[A-Za-z ]+$/, { message: "Name can only contain letters and spaces" })
        .trim(),
    username: z.string()
        .min(USERNAME_LENGTH.MIN, { message: `Username cannot be empty` })
        .max(USERNAME_LENGTH.MAX, { message: `Username maximum ${USERNAME_LENGTH.MAX} characters` })
        .regex(/^[A-Za-z0-9_]+$/, { message: `Username can only contain letters, number and underscore(_)` })
        .trim()
        .toLowerCase(),
    profileImagePublicId: z.string()
        .min(1, { message: `Profile image upload failed` })
        .max(100, { message: `An error occur when uploading profile image` })
        .regex(/^[A-Za-z0-9/_-]+$/, { message: "Invalid cloudinary public id format" })
        .nullable()
        .optional(),
    profileImageUrl: z.string()
        .url({ message: "Invalid image URL" })
        .max(300, { message: `An error occur when uploading profile image` })
        .refine((url) => url.includes("res.cloudinary.com") || url.includes("googleusercontent.com"), { message: "Invalid image source" })
        .nullable()
        .optional(),
    bio: z.string()
        .max(BIO_LENGTH.MAX, { message: `Bio maximum ${BIO_LENGTH.MAX} characters` })
        .trim(),
    dateOfBirth: z.string({message : "Please enter your Date of Birth"})
        .min(1, { message: "Please enter your Date of Birth" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Something went wrong, please try again" })
})

export const authenticateUserSchema = z.object({
    email: z.string()
        .min(1, { message: "Email cannot be empty" })
        .email({ message: "Invalid email format" })
        .max(120, { message: "Email maximum 120 characters" })
        .trim(),
    password: z.string()
        .max(PASSWORD_LENGTH.MAX, { message: `Password maximum ${PASSWORD_LENGTH.MAX} characters` })
        .trim()
})

export const updateUserProfile = z.object({
    name: z.string()
        .min(NAME_LENGTH.MIN, { message: `Name cannot be empty` })
        .max(NAME_LENGTH.MAX, { message: `Name maximum ${NAME_LENGTH.MAX} characters` })
        .regex(/^[A-Za-z ]+$/, { message: "Name can only contain letters and spaces" })
        .trim(),
    bio: z.string()
        .max(BIO_LENGTH.MAX, { message: `Bio maximum ${BIO_LENGTH.MAX} characters` })
        .trim(),
    profileImagePublicId: z.string()
        .min(1, { message: `Profile image upload failed` })
        .max(100, { message: `An error occur when uploading profile image` })
        .regex(/^[A-Za-z0-9/_-]+$/, { message: "Invalid cloudinary public id format" })
        .nullable()
        .optional(),
    profileImageUrl: z.string()
        .url({ message: "Invalid image URL" })
        .max(300, { message: `An error occur when uploading profile image` })
        .refine((url) => url.includes("res.cloudinary.com"), { message: "Invalid image source" })
        .nullable()
        .optional(),
    coverImagePublicId: z.string()
        .min(1, { message: `Profile image upload failed` })
        .max(100, { message: `An error occur when uploading profile image` })
        .regex(/^[A-Za-z0-9/_-]+$/, { message: "Invalid cloudinary public id format" })
        .nullable()
        .optional(),
    coverImageUrl: z.string()
        .url({ message: "Invalid image URL" })
        .max(300, { message: `An error occur when uploading profile image` })
        .refine((url) => url.includes("res.cloudinary.com"), { message: "Invalid image source" })
        .nullable()
        .optional(),
})

export type CreateUserProfileSchema = z.infer<typeof createUserProfileSchema>
export type CreateUserSchema = z.infer<typeof createUserSchema>
export type AuthenticateUserSchema = z.infer<typeof authenticateUserSchema>
export type UpdateUserProfile = z.infer<typeof updateUserProfile>