import api from "../axiosInstance";

const handleApiError = (error) => {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    console.error("Auth API Error:", errorMessage);
    throw new Error(errorMessage);
};

export const userAuthStatus = async () => {
    try {

        const { data } = await api.get('/api/v1/auth/users/auth-status');
        console.log('data recieved from backend:', data);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};


export const userLogin = async ({ userData }) => {

    console.log('userData recievd from userLogin route:', userData);
    try {
        const { data } = await api.post('/api/v1/auth/users/login', userData);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

export const userLogout = async () => {
    try {
        const { data } = await api.post('/api/v1/auth/users/logout');
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

export const userRegistration = async ({ userData }) => {
    console.log('userData catched from usrRegistrationApi', userData);
    try {
        const { data } = await api.post('/api/v1/auth/users/register', userData);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

export const refreshAccessToken = async () => {
    try {
        const { data } = await api.post('/api/v1/auth/users/refresh');
        return data;
    } catch (error) {
        handleApiError(error);
    }
};

export const sendOtp = async ({ email }) => {
    try {

        console.log('email to send otp:', email);
        const { data } = await api.post('/api/v1/auth/users/send-otp', { email });
        console.log('data recieved from send-otp route:', data);
        return data;
    } catch (error) {
        handleApiError(error);
    }
};
