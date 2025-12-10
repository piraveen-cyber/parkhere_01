import User, { IUser } from '../models/User';

export const createUserProfile = async (data: Partial<IUser>): Promise<IUser> => {
    const { supabaseId } = data;
    if (!supabaseId) throw new Error("Supabase ID is required");

    // Upsert: Update if exists, create if not
    const user = await User.findOneAndUpdate(
        { supabaseId },
        data,
        { new: true, upsert: true }
    );

    return user;
};

export const getUserProfile = async (supabaseId: string): Promise<IUser | null> => {
    return await User.findOne({ supabaseId });
};
