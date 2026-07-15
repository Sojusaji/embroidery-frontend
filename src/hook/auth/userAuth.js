import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
    userLogin as apiLogin,
    userRegistration as apiRegistration,
    userLogout as apiLogout,
    refreshAccessToken as apiRefreshAccessToken,
    sendOtp as apiSendOtp,
    verifyUser,
    userAuthStatus,
    apiGoogleLogin
} from "../../api/authApi/userAuthApi.js";

export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const data = await userAuthStatus();
            return data?.user || null;
        },
        retry: (failureCount, error) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
};

export const useGoogleLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['googleLogin'],
        mutationFn: apiGoogleLogin,
        onSuccess: (data) => {
            if (data?.user) {
                queryClient.setQueryData(['userProfile'], data.user);
                queryClient.invalidateQueries({ queryKey: ['userProfile'] });
                localStorage.setItem('isLoggedIn', 'true');
            }
        },
        onError: (error) => {
            console.error("Login mutation failed:", error.message);
        }
    });
};

export const useVerifyUser = () => {
    return useMutation({
        mutationKey: ['verifyUser'],
        mutationFn: verifyUser,
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
                queryClient.invalidateQueries({ queryKey: ['userProfile'] });
                localStorage.setItem('isLoggedIn', 'true');
            }
        },
        onError: (error) => {
            console.error("Login mutation failed:", error.message);
        }
    });
};

export const useUserLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['userLogout'],
        mutationFn: apiLogout,
        onSuccess: () => {
            queryClient.setQueryData(['userProfile'], null);
            queryClient.removeQueries();
            localStorage.removeItem('isLoggedIn');
        },
        onError: (error) => {
            console.error("Logout mutation failed:", error.message);
        }
    });
};

export const useUserRegistration = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['userRegistration'],
        mutationFn: apiRegistration,
        onSuccess: (data) => {
            if (data?.user) {
                queryClient.setQueryData(['userProfile'], data.user);
                queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            }
        },
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
            queryClient.setQueryData(['userProfile'], null);
            queryClient.removeQueries();
            localStorage.removeItem('isLoggedIn');
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