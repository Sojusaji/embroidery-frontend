import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, uploadProductImage, createProduct } from '../api/productApi';

export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: ({ file, category }) => {
      const data = new FormData();
      data.append("category",category);
      data.append('image',file);
     return uploadProductImage(data)
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
