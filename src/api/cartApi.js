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

export const updateCartItemQuantity = async (cartData) => {
    console.log('cartData recieved on api are:',cartData);
    const { data } = await api.patch('/api/v1/cart',cartData);
    return data;
}

export const removeCartItem = async (cartData) => {
    console.log('cartData recieved for deleting cart on api are:',cartData.productId);
    const { data } = await api.delete(`/api/v1/cart/${cartData.productId}`);
    return data;
}