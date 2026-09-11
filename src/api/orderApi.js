import api from "./axiosInstance";


export const fetchOrders = async () => {
    const { data } = await api.get('/api/v1/orders');
    return data;
}


export const createOrder = async (orderPayload) => {
    const { data } = await api.post('/api/v1/orders', orderPayload);
    return data;
}