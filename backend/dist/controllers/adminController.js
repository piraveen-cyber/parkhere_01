"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.registerAdmin = exports.loginAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); // Need to install types
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
// Generate JWT
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'default_secret_key', {
        expiresIn: '30d',
    });
};
// @desc    Auth Super Admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // DEV MODE: Hardcoded Access
    if (email === "admin@gmail.com" && password === "admin") {
        const token = jsonwebtoken_1.default.sign({ id: "dev-super-admin", role: "SUPER_ADMIN" }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "30d" });
        return res.status(200).json({
            _id: "dev-super-admin",
            email: "admin@gmail.com",
            role: "SUPER_ADMIN",
            token,
        });
    }
    try {
        // Check if admin exists
        const admin = yield Admin_1.default.findOne({ email });
        if (admin && (yield bcryptjs_1.default.compare(password, admin.passwordHash))) {
            if (!admin.isActive) {
                return res.status(403).json({ message: 'Account suspended' });
            }
            res.json({
                _id: admin._id,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id, admin.role),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.loginAdmin = loginAdmin;
// @desc    Register a new Admin (Initial seeding usually)
// @route   POST /api/admin/auth/register
// @access  Super Admin only (or seeded)
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    try {
        const adminExists = yield Admin_1.default.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const passwordHash = yield bcryptjs_1.default.hash(password, salt);
        const admin = yield Admin_1.default.create({
            email,
            passwordHash,
            role: role || 'SUPER_ADMIN',
        });
        if (admin) {
            res.status(201).json({
                _id: admin._id,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id, admin.role),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerAdmin = registerAdmin;
// @desc    Get current admin profile & validity
// @route   GET /api/admin/auth/me
// @access  Private (Admin)
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.default.findById(req.admin._id).select('-passwordHash');
    res.json(admin);
});
exports.getMe = getMe;
