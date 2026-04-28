import { useMutation } from "@tanstack/react-query"
import { adminLogin } from "../api/authApi";
import { useNavigate } from "react-router-dom"

export const useAdminLogin =  () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async ({ email, password }) => await adminLogin({email, password}),
        mutationKey: ['admin-login'],

        onSuccess: (data) => {
            console.log('Login successful kdjksjfjsljsjdflks', data);
            navigate('/admin', { replace: true });
        },
        onError: (error) => {
            console.log('login failed:', error?.message);
        }
    })
}