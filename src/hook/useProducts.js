import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchTrashedProducts, uploadProductImage,purgeProduct, restoreProduct, createProduct, deleteProduct } from '../api/productApi';

export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products', 'live'],
    queryFn: fetchProducts,
  });
};


// 2. Fetch all items currently sitting inside the trash bin repository
export const useGetTrashedProducts = () => {
  return useQuery({
    queryKey: ['products', 'trash'],
    queryFn: fetchTrashedProducts,
  });
};





// 3. Mutation Hook to soft delete a live item
export const useDeleteAProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// 4. Mutation Hook to restore a record back to the store catalog
export const useRestoreProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

// 5. Mutation Hook to permanently purge a product or empty the whole trash bin
export const usePurgeProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purgeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};









export const useUploadImage = () => {
  return useMutation({
    mutationFn: ({ file, category }) => {
      const data = new FormData();
      data.append("category", category);
      data.append('image', file);
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

// export const useDeleteAProduct = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteProduct,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['products'] });
//     }
//   })
// }