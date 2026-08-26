import api from "./axiosInstance";

export const createOrder = async (orderData) => {
    const { data } = await api.post('/api/v1/order', orderData);
    return data;
}