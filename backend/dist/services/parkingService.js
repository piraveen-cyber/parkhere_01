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
exports.createSpot = exports.getAllSpots = void 0;
const ParkingSpot_1 = __importDefault(require("../models/ParkingSpot"));
const getAllSpots = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ParkingSpot_1.default.find();
});
exports.getAllSpots = getAllSpots;
const createSpot = (spotData) => __awaiter(void 0, void 0, void 0, function* () {
    const newSpot = new ParkingSpot_1.default(spotData);
    return yield newSpot.save();
});
exports.createSpot = createSpot;
