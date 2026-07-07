import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// Imported names kept as-is
import {
    userAuthStatus as apiAuthStatus,
    userLogin as apiLogin,
    userRegistration as apiRegistration,
    userLogout as apiLogout,
    refreshAccessToken as apiRefreshAccessToken,
    sendOtp as apiSendOtp
} from "../../api/authApi/userAuthApi.js";


export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: () => apiAuthStatus(),
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
};


export const useVerifyUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['verifyUser'],
        mutationFn: apiAuthStatus,
        onSuccess: (data) => {
            if (data?.exists && data?.user) {
                queryClient.setQueryData(['userProfile'], data.user);
            }
        }
    });
};

export const useUserLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["userLogin"],
        mutationFn: apiLogin,
        onSuccess: (data) => {
            if (data?.user) {
                queryClient.setQueryData(['userProfile'], data.user);
            }
        },
        onError: (error) => {
            console.error("Login mutation failed:", error.message);
        }
    });
};


export const useUserLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationKey: ['userLogout'],
        mutationFn: apiLogout,
        onSuccess: () => {
            queryClient.clear();
        },
        onError: (error) => {
            console.error("Logout mutation failed:", error.message);
        }
    });
};


export const useUserRegistration = () => {

    return useMutation({
        mutationKey: ['userRegistration'],
        mutationFn: apiRegistration,
        onError: (error) => {
            console.error("Registration mutation failed:", error.message);
        }
    });
};



export const useRefreshAccessToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['userRefreshAccessToken'],
        mutationFn: apiRefreshAccessToken,

        onError: (error) => {
            console.error("Token refresh mutation failed:", error.message);
            queryClient.clear();
        }
    });
};



export const useSendOtp = () => {
    return useMutation({
        mutationKey: ['sendOtp'],
        mutationFn: apiSendOtp,
        onError: (error) => {
            console.error("Send OTP mutation failed:", error.message);
        }
    });
};