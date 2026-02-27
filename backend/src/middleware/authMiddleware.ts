import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};
