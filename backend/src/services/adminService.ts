import Booking from '../models/Booking';
import User from '../models/User';
import ParkingSpot from '../models/ParkingSpot';

export const getSystemStats = async () => {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalParkingSpots = await ParkingSpot.countDocuments();

    const revenueResult = await Booking.aggregate([
        { $match: { status: { $in: ['active', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return {
        totalUsers,
        totalBookings,
        totalParkingSpots,
        totalRevenue
    };
};

export const getAllBookings = async () => {
    return await Booking.find().populate('parkingSpotId');
};

export const getAllUsers = async () => {
    return await User.find();
};
