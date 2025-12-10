import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        // In a real app, you'd verify the token matches the supabaseId here
        const user = await userService.createUserProfile(userData);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserProfile(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
