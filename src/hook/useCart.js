import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCart, fetchCartData } from "../api/cartApi";
import { logError } from "../utils/logger";


export const useFetchCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: fetchCartData,
        staleTime: 1000 * 60 * 5
    })
}

export const useAddToCart = () => {
    console.log('useAddToCart hook called with cart data:');
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartPayload) => createCart(cartPayload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error) => {
            logError("Cart update failed:", error);
        }
    })
}