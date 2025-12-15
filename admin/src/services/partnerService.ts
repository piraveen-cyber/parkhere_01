import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

export interface Partner {
    _id: string;
    userId: string;
    businessName: string;
    email: string;
    phone: string;
    kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    isActive: boolean;
    createdAt: string;
    serviceTypes: string[]; // IDs
    kycDocuments: {
        docType: string;
        url: string;
        status: 'pending' | 'approved' | 'rejected';
    }[];
}

export const getPartners = async (): Promise<Partner[]> => {
    const response = await axios.get(`${API_URL}/partners`);
    return response.data;
};

export const updatePartnerKYC = async (id: string, status: 'APPROVED' | 'REJECTED'): Promise<Partner> => {
    const response = await axios.put(`${API_URL}/partners/${id}/kyc`, { status });
    return response.data;
};
