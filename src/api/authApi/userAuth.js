import api from "../axiosInstance";


export const userAuthStatus = async () => {
    try {
        const { data } = await api.get('/api/v1/auth/users/login/verify-user');
        return data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "unexpected error occured";
        console.error('auth error:', errorMessage);
        throw new Error(errorMessage);
    }


}

export const userLogin = (userData) => {
    try {
        const { data } = api.post('/api/v1/auth/users/login/verify-otp', userData);
        return data;
    } catch (error) {
        const errorMessage=error?.response?.data?.message || "unexpected error occured";
        console.error('auth error',errorMessage);
        throw new Error(errorMessage)
    }
}