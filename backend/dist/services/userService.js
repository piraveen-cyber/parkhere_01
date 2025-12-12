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
exports.getUserProfile = exports.createUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const createUserProfile = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { supabaseId } = data;
    if (!supabaseId)
        throw new Error("Supabase ID is required");
    // Upsert: Update if exists, create if not
    const user = yield User_1.default.findOneAndUpdate({ supabaseId }, data, { new: true, upsert: true });
    return user;
});
exports.createUserProfile = createUserProfile;
const getUserProfile = (supabaseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.findOne({ supabaseId });
});
exports.getUserProfile = getUserProfile;
