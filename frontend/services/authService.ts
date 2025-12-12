// app/services/authService.ts
// NOTE: Replace mocks with real API call implementations (axios/fetch)
export const sendOtpMock = async (phone: string) => {
    console.log("sendOtpMock to", phone);
    // simulate network delay
    await new Promise(r => setTimeout(r, 600));
    return true;
};

export const verifyOtpMock = async (phone: string, otp: string) => {
    console.log("verifyOtpMock", phone, otp);
    await new Promise(r => setTimeout(r, 600));
    // Accept "1234" as valid OTP in mock
    return otp === "1234" || otp === "0000";
};
