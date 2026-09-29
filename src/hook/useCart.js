import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCart, fetchCartData, updateCartItemQuantity, removeCartItem } from "../api/cartApi";
import { logError } from "../utils/logger";
import { fetchProducts } from "../api/productApi";


const roundToTwoDecimals = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};


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

        onMutate: async (cartPayload) => {

            await queryClient.cancelQueries({ queryKey: ['cart'] });

            const previousCart = queryClient.getQueryData(['cart']);
            const itemPayload = cartPayload?.items?.[0];
            if (!itemPayload) {
                return { previousCart }
            };
            const { productId, quantity } = cartPayload?.items[0];

            const products = await queryClient.ensureQueryData({
                queryKey: ['products', 'live'],
                queryFn: fetchProducts
            })

            const addingProduct = products?.find((p) => p.id === productId || p._id === productId);
            if (!addingProduct) {
                console.error('Product not found in cache for optimistic update');
                return { previousCart };
            }


            queryClient.setQueryData(['cart'], (oldData) => {
                if (!oldData) return oldData;
                console.log('oldData received from useAddToCart:', oldData);

                const items = oldData?.cartItems || [];

                const currentItemIndex = items.findIndex((item) => (item._id || item.id) === productId);

                let updatedCartItems;

                if (currentItemIndex > -1) {
                    updatedCartItems = items.map((item) => {
                        const itemId = item._id || item.id;
                        if (itemId === productId) {
                            return {
                                ...item,
                                quantity: (item.quantity || 0) + quantity
                            }
                        }
                        return item;
                    });
                }
                else {
                    const { name, id, image, price, totalStock } = addingProduct;
                    const newItem = {
                        _id: id,
                        name,
                        image,
                        price,
                        totalStock,
                        quantity
                    };
                    updatedCartItems = [...items, newItem];
                }
                let newTotalItems = 0;
                let newTotalPrice = 0;

                updatedCartItems.forEach((item) => {
                    const itemPrice = (item.price || 0) * (item.quantity || 0);
                    newTotalPrice += itemPrice;
                    newTotalItems += (item.quantity || 0);

                })
                return {
                    ...oldData,
                    cartItems: updatedCartItems,
                    grandTotal: roundToTwoDecimals(newTotalPrice),
                    totalQuantity: newTotalItems,
                }
            })
            return { previousCart };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart'], context.previousCart)
            }
            logError("Item adding to cart failed:", error);
        }
    })
}

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