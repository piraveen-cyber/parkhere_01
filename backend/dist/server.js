"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const parkingRoutes_1 = __importDefault(require("./routes/parkingRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const problemRoutes_1 = __importDefault(require("./routes/problemRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database Connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parkhere')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Routes
app.use('/api/parking', parkingRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/problems', problemRoutes_1.default);
// Basic Route
app.get('/', (req, res) => {
    res.send('ParkHere Backend is running');
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
