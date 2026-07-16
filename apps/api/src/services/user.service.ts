import { CreateUserProfileSchema, ERROR_RESPONSE_CODE, UpdateUserProfile, UserProfileDTO, UserSummaryDTO } from "@connect/shared";
import { User } from "../models/user.model";
import { AppError } from "../errors/appError.error";
import { removeTemp } from "../utils/path";
import cloudinary from "../config/cloudinary.config";
import { UserProfileQuery, UserSummaryQuery } from "../types/user.type";
import { toUserProfileDTO, toUserSummaryDTO } from "../mappers/user.mapper";
import { Following } from "../models/following.model";
import mongoose from "mongoose";
import { commitTempImage } from "../helpers/cloudinary.helper";

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

export const getUserProfile = async (username : string, currentUserId : string | undefined) : Promise<UserProfileDTO> => {
    const user = await User.findOne({username})
    .select("_id username name bio profileImage coverImage createdAt followerCount followingCount")
    .lean<UserProfileQuery>();

    if(!user) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "user not found");
    }

    let isFollowing = false;
    if(currentUserId && currentUserId != user._id.toString()) {
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

export const updateProfile = async (currentUserId : string, data : UpdateUserProfile) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async() => {
            const user = await User.findById(currentUserId)
            .select("coverImage profileImage isOnboarded name bio")
            .session(session);
        
            if(!user) {
                throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "User not found");
            }

            // delete cover
            if(!data.coverImagePublicId && user.coverImage) {
               await cloudinary.api.delete_resources([user.coverImage.publicId]);

               user.coverImage = null;
            }

            // delete profile image
            if(!data.profileImagePublicId && user.profileImage) {
                await cloudinary.api.delete_resources([user.profileImage.publicId]);

                user.profileImage = null;
            }
        
            // update cover image
            if(data.coverImagePublicId && data.coverImageUrl && data.coverImagePublicId !== user?.coverImage?.publicId) {
                const result = await commitTempImage(data.coverImagePublicId, user.coverImage?.publicId);

                if(!result) return;

                // change the cover data
                user.coverImage = {
                    publicId : result.publicId,
                    url : result.url,
                };
            }
        
            // update profile image
            if(data.profileImagePublicId && data.profileImageUrl && data.profileImagePublicId !== user?.profileImage?.publicId) {
                const result = await commitTempImage(data.profileImagePublicId, user.profileImage?.publicId);

                if(!result) return;

                // change the cover data
                user.profileImage = {
                    publicId : result.publicId,
                    url : result.url,
                };
            }
        
            // update data
            user.name = data.name;
            user.bio = data.bio;
        
            await user.save({session})
        })
    } finally {
        await session.endSession();
    }
}

export const searchUsers = async (query: string) : Promise<UserSummaryDTO[]> => {
    const users = await User.aggregate<UserSummaryQuery>([
        {
            $match : {
                $or : [
                    {username : {$regex : query, $options : 'i'}},
                    {username : {$regex : query, $options : 'i'}}
                ]
            }
        },
        {
            $addFields : {
                score : {
                    $switch : {
                        branches : [
                            {
                                case : {
                                    $regexMatch : {
                                        input : "$username",
                                        regex : `^${query}$`,
                                        options : "i",
                                    }
                                },
                                then : 100,
                            },
                            {
                                case : {
                                    $regexMatch : {
                                        input : "$username",
                                        regex : `^${query}`,
                                        options : "i",
                                    }
                                },
                                then : 80,
                            },
                            {
                                case : {
                                    $regexMatch : {
                                        input : "$name",
                                        regex : `^${query}`,
                                        options : 'i'
                                    }
                                },
                                then : 60
                            },
                            {
                                case : {
                                    $regexMatch : {
                                        input : "$name",
                                        regex : query,
                                        options : "i",
                                    }
                                },
                                then : 60
                            }
                        ],
                        default : 0,
                    }
                }
            }
        },
        {
            $sort : {
                score : -1,
                followerCount : -1,
            }
        },
        {
            $limit : 5,
        },
        {
            $project : {
                _id : 1,
                name : 1,
                username : 1,
                profileImage : 1,
            }
        },
    ]);

    const formattedUsers = users.map(toUserSummaryDTO);

    return formattedUsers;
}