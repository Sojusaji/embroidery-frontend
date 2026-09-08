import api from "./axiosInstance";

export const createOrder = async (orderPayload) => {
    const { data } = await api.post('/api/v1/orders', orderPayload);
    return data;
}