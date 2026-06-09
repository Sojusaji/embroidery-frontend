import api from './axiosInstance';

export const fetchProducts = async () => {
  const { data } = await api.get('/api/products');
  return data;
};

export const fetchTrashedProducts = async () => {
  const { data } = await api.get('/api/products/product-trash');
  return data;
}


export const restoreProduct = async (productId) => {
  const { data } = await api.post('/api/products/product-restore', { productId });
  return data;
}


export const purgeProduct = async (productId) => {
  const { data } = await api.delete('/api/products/product-purge', { data: { productId } });
  return data;
}


export const uploadProductImage = async (data) => {
  console.log("data:", data);
  const { data: response } = await api.post('/api/products/image-upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('response via uploadproductImage route:', response);
  return response;
};

export const createProduct = async (productData) => {
  console.log('productData coming for mutation function:', productData);
  const { data } = await api.post('/api/products', productData);
  return data;
};

export const deleteProduct = async (productId) => {
  console.log('deleteToProduct:', productId);
  const { data } = await api.delete('/api/products/product-delete', { params: { productId } });
  return data;
}


