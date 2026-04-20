import {z} from "zod";
import { NAME_LENGTH, PASSWORD_LENGTH, USERNAME_LENGTH } from "./user.const";

export const createUserSchema = z.object({
    name : z.string()
        .min(NAME_LENGTH.MIN, {message : `Name cannot be empty`})
        .max(NAME_LENGTH.MAX, {message : `Name maximum ${NAME_LENGTH.MAX} characters`})
        .regex(/^[A-Za-z ]+$/, {message : "Name can only contain letters and spaces"})
        .trim(),
    username : z.string()
        .min(USERNAME_LENGTH.MIN, {message : `Username cannot be empty`})
        .max(USERNAME_LENGTH.MAX, {message : `Username maximum ${USERNAME_LENGTH.MAX} characters`})
        .regex(/^[A-Za-z0-9_]+$/, {message : `Username can only contain letters, number and underscore(_)`}),
    email : z.string()
        .email({message : "Invalid email format"})
        .max(120, {message : 'Email maximum 120 characters'})
        .trim(),
    password : z.string()
        .min(PASSWORD_LENGTH.MIN, {message : `Password minimum ${PASSWORD_LENGTH.MIN} characters`})
        .max(PASSWORD_LENGTH.MAX, {message : `Password maximum ${PASSWORD_LENGTH.MAX} characters`})
        .trim(),
});

export const authenticateUserSchema = z.object({
    email : z.string()
        .email({message : "Invalid email format"})
        .max(120, {message : "Email maximum 120 characters"})
        .trim(),
    password : z.string()
        .max(PASSWORD_LENGTH.MAX, {message : `Password maximum ${PASSWORD_LENGTH.MAX} characters`})
        .trim()
})

export type CreateUserSchema = z.infer<typeof createUserSchema>
export type AuthenticateUserSchema = z.infer<typeof authenticateUserSchema>