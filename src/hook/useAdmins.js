import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdmins, createAdmin, deleteAdmin } from '../api/adminApi';

export const useAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};
