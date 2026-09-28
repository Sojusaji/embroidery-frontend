import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCart, fetchCartData, updateCartItemQuantity, removeCartItem } from "../api/cartApi";
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
            logError("Item adding to cart failed:", error);
        }
    })
}

const roundToTwoDecimals = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const useUpdateCartItemQuantity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartPayload) => updateCartItemQuantity(cartPayload),

        onMutate: async ({ productId, change }) => {
            console.log('data recieved on useHook:', productId, change);
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const previousCart = queryClient.getQueryData(['cart']);
            console.log("previousCart:", previousCart);

            queryClient.setQueryData(['cart'], (oldData) => {
                console.log('oldData snapshot:', JSON.stringify(oldData, null, 2));
                if (!oldData) return oldData;
                const cartContainer = oldData.cart || oldData;
                const items = cartContainer.cartItems || [];

                const updatedCartItems = items.map((item) => {
                    const currentId = item?._id?.toString() || item.productId?.toString();
                    if (currentId === productId.toString()) {
                        return {
                            ...item, quantity: item.quantity + change
                        }
                    }
                    return item;
                }).filter((item) => item.quantity > 0);
                let newTotalPrice = 0;
                let newTotalItems = 0;
                updatedCartItems.forEach(item => {
                    const itemPrice = item.price * item.quantity;
                    newTotalPrice += itemPrice;
                    newTotalItems += item.quantity;

                });
                const newCartData = {
                    ...cartContainer,
                    cartItems: updatedCartItems,
                    totalQuantity: newTotalItems,
                    grandTotal: roundToTwoDecimals(newTotalPrice)
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
                const items = cartContainer.cartItems || [];
                const updatedCartItems = items.filter((item) => {
                    const currentId = item?._id?.toString() || item.productId?.toString();
                    return currentId !== productId.toString();
                });
                let totalPrice = 0;
                let totalItems = 0;
                updatedCartItems.forEach((item) => {
                    const itemPrice = item.price * item.quantity;
                    totalPrice += itemPrice;
                    totalItems += item.quantity;
                })
                const newCartData = {
                    ...cartContainer,
                    cartItems: updatedCartItems,
                    grandTotal: totalPrice,
                    totalQuantity: totalItems

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