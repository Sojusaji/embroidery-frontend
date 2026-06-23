import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { adminAuthStatus, adminLogin, adminLogout } from "../../api/authApi/adminAuthApi.js";


export const useAdminAuth = () => {
    return useQuery({
        queryKey: ['adminAuthStatus'],
        queryFn: async () => {
            const { data } = await adminAuthStatus();
            return data;
        },
        retry: false
    })
}

export const useAdminLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: adminLogout,
        onSuccess: () => {
            queryClient.setQueryData(['adminAuthStatus'], null);
            queryClient.clear();
            navigate('/admin/login', { replace: true });
        },
        onError: (error) => {
            console.error('Logout failed:', error.message);
        }
    });
};

export const useAdminLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ email, password }) => await adminLogin({ email, password }),
        mutationKey: ['admin-login'],

        onSuccess: (data) => {
            console.log('Login successful kdjksjfjsljsjdflks', data);
            queryClient.invalidateQueries(['adminAuthStatus'])
            navigate('/admin', { replace: true });
        },
        onError: (error) => {
            console.log('login failed:', error?.message);
        }
    })
}

