import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // Need to install types
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

// Generate JWT
const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'default_secret_key', {
        expiresIn: '30d',
    });
};

// @desc    Auth Super Admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // DEV MODE: Hardcoded Access
    if (email === "admin@gmail.com" && password === "admin") {
        const token = jwt.sign(
            { id: "dev-super-admin", role: "SUPER_ADMIN" },
            process.env.JWT_SECRET || "dev_secret",
            { expiresIn: "30d" }
        );
        return res.status(200).json({
            _id: "dev-super-admin",
            email: "admin@gmail.com",
            role: "SUPER_ADMIN",
            token,
        });
    }

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });

        if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
            if (!admin.isActive) {
                return res.status(403).json({ message: 'Account suspended' });
            }

            res.json({
                _id: admin._id,
                email: admin.email,
                role: admin.role,
                token: generateToken((admin._id as unknown) as string, admin.role),

            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Register a new Admin (Initial seeding usually)
// @route   POST /api/admin/auth/register
// @access  Super Admin only (or seeded)
export const registerAdmin = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            email,
            passwordHash,
            role: role || 'SUPER_ADMIN',
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                email: admin.email,
                role: admin.role,
                token: generateToken((admin._id as unknown) as string, admin.role),

            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current admin profile & validity
// @route   GET /api/admin/auth/me
// @access  Private (Admin)
export const getMe = async (req: any, res: Response) => {
    const admin = await Admin.findById(req.admin._id).select('-passwordHash');
    res.json(admin);
};
