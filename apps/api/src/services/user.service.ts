import { CreateUserProfileSchema, ERROR_RESPONSE_CODE, UserProfileDTO, UserSummaryDTO } from "@connect/shared";
import { User } from "../models/user.model";
import { AppError } from "../errors/appError.error";
import { removeTemp } from "../utils/path";
import cloudinary from "../config/cloudinary.config";
import { UserProfileQuery, UserSummaryQuery } from "../types/user.type";
import { toUserProfileDTO, toUserSummaryDTO } from "../mapper/user.mapper";
import { Following } from "../models/following.model";

type OnboardingPayload = {
    userId: string,
    userData: CreateUserProfileSchema,
}

export const onboarding = async (payload: OnboardingPayload) => {
    const user = await User.findById(payload.userId);

    if (!user) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "User not found");
    }

    if(user.isOnboarded) {
        throw new AppError(409, ERROR_RESPONSE_CODE.conflict, "User is already onboarded");
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

export const getUserProfile = async (currentUserId : string, username : string) : Promise<UserProfileDTO> => {
    const user = await User.findOne({username})
    .select("_id username name bio profileImage createdAt followerCount followingCount")
    .lean<UserProfileQuery>();

    if(!user) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "user not found");
    }

    let isFollowing;
    if(currentUserId != user._id.toString()) {
        isFollowing = !!(await Following.exists({userId : currentUserId, followUserId : user._id}));
    }
    
    return toUserProfileDTO(user, isFollowing);
}

export const checkUsernameAvailability = async (username: string) => {
    const user = await User.exists({ username });
    return !user;
}

export const getUserSummary = async (userId : string) : Promise<UserSummaryDTO> => {
    const userSummary = await User.findById(userId).select("_id username name profileImage").lean<UserSummaryQuery>();

    if(!userSummary) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "User is not found");
    }

    return toUserSummaryDTO(userSummary);
}