"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const problemController_1 = require("../controllers/problemController");
const authAdmin_1 = require("../middleware/authAdmin");
const router = express_1.default.Router();
// Public / User Routes
router.post('/', problemController_1.createProblemReport); // Create Report
// Admin Routes (Protected)
router.get('/', authAdmin_1.protectAdmin, problemController_1.getAllProblemReports); // List Reports
router.get('/:id', authAdmin_1.protectAdmin, problemController_1.getProblemReportById); // Get Detail
router.patch('/:id/status', authAdmin_1.protectAdmin, problemController_1.updateProblemStatus); // Update Status
router.post('/:id/notes', authAdmin_1.protectAdmin, problemController_1.addProblemNote); // Add Internal Note
exports.default = router;
