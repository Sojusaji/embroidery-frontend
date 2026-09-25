import api from './axiosInstance';

export const createCart = async (cartData) => {
    console.log('createCart api is called with cartdata:', cartData);
    const { data } = await api.post('/api/v1/cart', cartData);
    return data;
}

export const fetchCartData = async () => {
    const { data } = await api.get('/api/v1/cart');
    return data;
}

export const updateCartItemQuantity = async () => {
    const { data } = await api.patch('/api/v1/cart');
    return data;
}

export const removeCartItem = async () => {
    const { data } = await api.delete('/api/v1/cart');
    return data;
}