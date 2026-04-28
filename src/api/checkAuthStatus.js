import api from "./axiosInstance.js";

export const checkAuthStatus = async () => {
    try {
        const { data } = await api.get('/api/admin/verify');
        console.log('authStatus:',data);
        return data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "unexpected error occured";
        console.error('auth error:',errorMessage);
        throw new Error(errorMessage);
    }
}