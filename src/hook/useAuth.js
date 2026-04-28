import { useQuery } from "@tanstack/react-query";
import { checkAuthStatus } from "../api/checkAuthStatus";

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