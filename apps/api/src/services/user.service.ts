import { CreateUserProfileSchema } from "@connect/shared";
import { User } from "../models/user.model";
import { AppError } from "../errors/appError.error";

type OnboardingPayload = {
    userId : string,
    userData : CreateUserProfileSchema,
}

export const onboarding = async (payload : OnboardingPayload) => {
    const user = await User.findById(payload.userId);

    if(!user) {
        throw new AppError(404, "NOT_FOUND", "User not found");
    }

    user.name = payload.userData.name;
    user.username = payload.userData.username;
    user.bio = payload.userData.bio;
    user.profileImage = {
        publicId : payload.userData.profileImagePublicId,
        url : payload.userData.profileImageUrl,
    }

    user.save();
}

export const checkUsernameAvailability = async (username : string) => {
    const user = await User.exists({username});
    return !user;
}