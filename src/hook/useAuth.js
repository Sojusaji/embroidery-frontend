import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkAuthStatus } from "../api/checkAuthStatus";
import { adminLogout } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    return useQuery({
        queryKey: ['authUser'],
        queryFn:async () => {
            const { data } =await checkAuthStatus();
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
            queryClient.setQueryData(['authUser'], null);
            queryClient.clear();
            navigate('/admin/login', { replace: true });
        },
        onError: (error) => {
            console.error('Logout failed:', error.message);
        }
    });
};