import { Request, Response } from 'express';
import User from '../models/User';

export const requestDisabilityVerification = async (req: Request, res: Response) => {
    try {
        const { userId, documentUrl } = req.body;

        // Find user by Supabase ID usually, but here we might use _id or supabaseId depending on frontend
        // Assuming body passes the correct ID
        const user = await User.findOne({ supabaseId: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.disabilityStatus = 'pending';
        user.disabilityDocumentUrl = documentUrl;
        await user.save();

        res.json({ message: 'Verification requested', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const approveDisabilityVerification = async (req: Request, res: Response) => {
    try {
        const { userId, status } = req.body; // status: 'verified' | 'rejected'
        const user = await User.findOne({ supabaseId: userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.disabilityStatus = status;
        await user.save();

        res.json({ message: `User disability status updated to ${status}`, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
