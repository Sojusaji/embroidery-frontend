import api from './axiosInstance';

export const fetchProducts = async () => {
  const { data } = await api.get('/api/v1/products');
  return data;
};

const fetchProductsByEndpoint = async (endpoint, { pageParam = null, limit = 10 } = {}) => {
  console.log('cursor and limit value from fetchProductsByEndpoint:',pageParam,limit);
  const { data } = await api.get(`/api/v1/products/${endpoint}`, {
    params: {
      limit,
      ...(pageParam && { cursor: pageParam })
    }
  });
  console.log('data from fetchProductByEndpoint:', data);
  return data;
}

export const fetchFeaturedProducts = (params) => fetchProductsByEndpoint('featured', params);

export const fetchLatestProducts = (params) => fetchProductsByEndpoint('latest', params);



export const fetchOneProduct = async (productId) => {
  console.log('fetchedOeProduct called and retried the product id:', productId);
  const { data } = await api.get(`/api/v1/products/${productId}`);
  console.log('fetched One Product from backend:', data);
  return data?.product;
}


export const fetchTrashedProducts = async () => {
  const { data } = await api.get('/api/v1/products/product-trash');
  return data;
}


export const restoreProduct = async (productId) => {
  const { data } = await api.post('/api/v1/products/product-restore', { productId });
  return data;
}


export const purgeProduct = async (productId) => {
  const { data } = await api.delete('/api/v1/products/product-purge', { data: { productId } });
  return data;
}


export const uploadProductImage = async (data) => {

  const { data: response } = await api.post('/api/v1/products/image-upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const createProduct = async (productData) => {
  const { data } = await api.post('/api/v1/products', productData);
  return data;
};

export const deleteProduct = async (productId) => {
  const { data } = await api.delete('/api/v1/products/product-delete', { params: { productId } });
  return data;
}

export const updateProduct = async ({ productId, productData }) => {
  const { data } = await api.patch(`/api/v1/products/product-update/${productId}`, productData);
  return data;
};

export const updateProductImage = async (data) => {

  const { data: response } = await api.patch('/api/v1/products/image-update', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};