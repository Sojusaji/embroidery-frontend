import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchTrashedProducts, uploadProductImage, purgeProduct, restoreProduct, createProduct, deleteProduct, updateProduct, updateProductImage } from '../api/productApi';

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, category }) => {
      const data = new FormData();
      data.append('image', file);
      if (category) data.append("category", category);
      return uploadProductImage(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },

    onError: (error) => {
      console.error('Image upload failed:', error.response?.data?.message || error.message);
    },
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



export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onMutate: async ({ productId, productData }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previousProducts = queryClient.getQueryData(['products']);

      queryClient.setQueryData(['products'], (old) => {
        if (!old) return [];
        if (Array.isArray(old)) {
          return old.map((product) =>
            product._id === productId
              ? { ...product, ...productData }
              : product
          );
        }
        return old;
      });
      return { previousProducts };
    },

    onError: (err, newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};



export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, filePath, sha }) => {
      console.log('file,filePath and sha', file,filePath,sha);
      
      const data = new FormData();
      data.append('image', file);
      if (filePath) data.append('filePath', filePath);
      if (sha) data.append('sha', sha);

      return await updateProductImage(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },

    onError: (error) => {
      console.error('Image update failed:', error.response?.data?.message || error.message);
    },
  });
};