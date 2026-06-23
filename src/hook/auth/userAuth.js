import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { userAuthStatus,userLogin } from "../../api/authApi/userAuth.js";
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
    return useQuery({
        queryKey: ['userAuthStatus'],
        queryFn: userAuthStatus,
        retry: false,
    })
}


export const userLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["userLogin"],
        mutationFn: userLogin,

        onSuccess: () => {
            queryClient.invalidateQueries(['userAuthStatus']);
            // navigate('/login')
        },

        onError: () => {
            queryClient.invalidateQueries(['userAuthStatus']);
            navigate('/login')
        }
    })
}

