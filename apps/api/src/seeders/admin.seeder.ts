import mongoose from "mongoose"
import { User } from "../models/user.model";
import { ROLES } from "@odiano/shared";
import { nanoid } from "nanoid";

export const createAdmin = async (email: string, password: string, name : string = "Admin") => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const user = await User.findOne({ email })
                .select("_id")
                .session(session);

            if(user) {
                console.log(`Admin already exists with email ${email}`);
                return;
            }

            await User.create({
                email,
                password,
                name : name,
                username: `admin_${nanoid(6).toString()}`,
                role : ROLES.ADMIN,
                emailVerifiedAt : new Date(),
                isOnboarded : true,
            });

            console.log(`Admin created with email ${email}`);
        });
    } finally {
        await session.endSession();
    }

    return;
}