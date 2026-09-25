import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCart, fetchCartData, updateCartItemQuantity, removeCartItem } from "../api/cartApi";
import { logError } from "../utils/logger";
import toast from "react-hot-toast";
import { cartSchema } from "../../../server/src/utils/authValidator";


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
            logError("Item adding to cart failed:", error);
        }
    })
}

export const useUpdateCartItemQuantity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartPayload) => updateCartItemQuantity(cartPayload),

        onMutate: async ({ productId, change }) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const previousCart = queryClient.getQueryData(['cart']);

            queryClient.setQueryData(['cart'], (oldData) => {
                if (!oldData) return oldData;
                const cartContainer = oldData.cart || oldData;
                const cartItems = cartContainer.items || [];

                const updatedCartItems = cartItems.map((item) => {
                    const currentId = item.productId?._id?.toString() || item.productId?.toString();
                    if (currentId === productId.toString()) {
                        return {
                            ...item, quantity: item.quantity + change
                        }
                    }
                    return item;
                }).filter((item) => item.quantity > 0);

                const newCartData = {
                    ...cartContainer,
                    items: updatedCartItems
                }
                return oldData.cart ? {
                    ...oldData, cart: newCartData
                } : newCartData;

            })

            return { previousCart };

        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart'], (context.previousCart));
            }
            logError('Cart item quantity updation failed', error);
        }
    })
}

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartPayload) => removeCartItem(cartPayload),
        onMutate: async ({ productId }) => {

            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const previousCart = queryClient.getQueryData(['cart']);
            queryClient.setQueryData(['cart'], (oldData) => {
                if (!oldData) return oldData;

                const cartContainer = oldData.cart || oldData;
                const cartItems = cartContainer.items || [];
                const updatedCartItems = cartItems.filter((item) => {
                    const currentId = item.productId?._id?.toString() || item.productId?.toString();
                    return currentId !== productId.toString();
                });
                const newCartData = {
                    ...cartContainer,
                    items: updatedCartItems
                };
                return oldData.cart ? {
                    ...oldData, cart: newCartData
                } : newCartData;
            })
            return { previousCart };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error, variables, context) => {
            if (context?.previousCart) {
                return queryClient.setQueryData(['cart'], (context.previousCart));
            }
            logError('Cart item removing failed', error);
        }
    })
}