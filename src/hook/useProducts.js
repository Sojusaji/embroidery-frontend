import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchTrashedProducts, uploadProductImage, purgeProduct, restoreProduct, createProduct, deleteProduct, updateProduct, updateProductImage } from '../api/productApi';
import { logError } from '../utils/logger';

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
      logError('Image upload failed:', error);
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

      const previousLiveProducts = queryClient.getQueryData(['products', 'live']);

      queryClient.setQueryData(['products', 'live'], (old) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((product) =>
          (product._id === productId || product.id === productId)
            ? { ...product, ...productData, updatedAt: new Date().toISOString() }
            : product
        );
      });
      return { previousLiveProducts };
    },

    onError: (err, newProduct, context) => {
      if (context?.previousLiveProducts) {
        queryClient.setQueryData(['products', 'live'], context.previousLiveProducts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'live'] });
    },
  });
};

export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, filePath, sha, folder }) => {
      const data = new FormData();
      data.append('image', file);
      if (filePath) data.append('filePath', filePath);
      if (sha) data.append('sha', sha);
      if (folder) data.append('folder', folder);

      return await updateProductImage(data);
    },

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'live'] });
    },

    onError: (error) => {
      logError('Image update failed:', error);
    },
  });
};