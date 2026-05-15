import { CreateUserProfileSchema, ERROR_RESPONSE_CODE } from "@connect/shared";
import { User } from "../models/user.model";
import { AppError } from "../errors/appError.error";
import { removeTemp } from "../utils/path";
import cloudinary from "../config/cloudinary.config";

type OnboardingPayload = {
    userId: string,
    userData: CreateUserProfileSchema,
}

export const onboarding = async (payload: OnboardingPayload) => {
    const user = await User.findById(payload.userId);

    if (!user) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "User not found");
    }

    // moved image from temp folder
    if (payload.userData.profileImagePublicId && payload.userData.profileImageUrl) {
        const oldPublicId = payload.userData.profileImagePublicId;
        const newPublicId = removeTemp(payload.userData.profileImagePublicId);

        const result = await cloudinary.uploader.rename(oldPublicId, newPublicId);
        
        if(result) {
            user.profileImage = {
                publicId: result.public_id,
                url: result.secure_url,
            }
        }
    }

    // set and save user data
    user.name = payload.userData.name;
    user.username = payload.userData.username;
    user.bio = payload.userData.bio;
    user.isOnboarded = true;


    user.save();
}

export const checkUsernameAvailability = async (username: string) => {
    const user = await User.exists({ username });
    return !user;
}