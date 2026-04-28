import api from './axiosInstance';

export const adminLogin = async ({email, password}) => {
    console.log('email && password:', email, password);

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    try {
        const { data } = await api.post('/api/admin/login', {
            email: email.toLowerCase(),
            password
        });
        console.log("login response:", data);
        if (process.env.NODE_ENV === 'development') {
            console.log('Admin login successful');
        }

        return data;
    } catch (error) {

        const errorMessage = error.response?.data?.message || "An unexpected error occurred during login.";

        console.error('Login Service Error:', errorMessage);
        throw new Error(errorMessage);
    }
};