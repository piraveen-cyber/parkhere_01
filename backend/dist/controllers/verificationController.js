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
exports.approveDisabilityVerification = exports.requestDisabilityVerification = void 0;
const User_1 = __importDefault(require("../models/User"));
const requestDisabilityVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, documentUrl } = req.body;
        // Find user by Supabase ID usually, but here we might use _id or supabaseId depending on frontend
        // Assuming body passes the correct ID
        const user = yield User_1.default.findOne({ supabaseId: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        user.disabilityStatus = 'pending';
        user.disabilityDocumentUrl = documentUrl;
        yield user.save();
        res.json({ message: 'Verification requested', user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.requestDisabilityVerification = requestDisabilityVerification;
const approveDisabilityVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, status } = req.body; // status: 'verified' | 'rejected'
        const user = yield User_1.default.findOne({ supabaseId: userId });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        user.disabilityStatus = status;
        yield user.save();
        res.json({ message: `User disability status updated to ${status}`, user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.approveDisabilityVerification = approveDisabilityVerification;
