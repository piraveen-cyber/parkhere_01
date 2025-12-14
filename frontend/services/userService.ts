import api from './api';

export interface UserProfile {
    supabaseId: string;
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    vehiclePlate?: string;
    avatarUrl?: string;
    vehicleModel?: string;
    vehicleType?: string;
    vehicleBrand?: string;
    fuelType?: string;
    transmission?: string;
}

export const updateUserProfile = async (data: UserProfile) => {
    const response = await api.post('/users', data);
    return response.data;
};

export const getUserProfile = async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};
