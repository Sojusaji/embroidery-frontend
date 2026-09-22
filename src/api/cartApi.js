import api from './axiosInstance';

export const createCart = async (cartData) => {
    console.log('createCart api is called with cartdata:',cartData);
    const { data } = await api.post('/api/v1/cart', cartData);
    return data;
}

export const fetchCartData = async () => {
    const { data } = await api.get('/api/v1/cart');
    return data;
}