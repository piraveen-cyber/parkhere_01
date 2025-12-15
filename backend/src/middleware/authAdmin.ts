import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

interface AuthRequest extends Request {
    admin?: any;
}

export const protectAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');

            req.admin = await Admin.findById(decoded.id).select('-passwordHash');

            if (!req.admin) {
                return res.status(401).json({ message: 'Not authorized, admin not found' });
            }

            if (!req.admin.isActive) {
                return res.status(403).json({ message: 'Admin account is inactive' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const superAdminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.admin && req.admin.role === 'SUPER_ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as super admin' });
    }
};
