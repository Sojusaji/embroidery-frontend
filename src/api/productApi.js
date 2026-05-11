import api from './axiosInstance';

export const fetchProducts = async () => {
  const { data } = await api.get('/api/products');
  return data;
};

export const uploadProductImage = async (data) => {
  console.log("data:",data);
  const { data:response } = await api.post('/api/products/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const createProduct = async (productData) => {
  const { data } = await api.post('/api/products', productData);
  return data;
};
