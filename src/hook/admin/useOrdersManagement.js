import { useQuery, useMutation, QueryClient, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFullOrders, fetchOrderStatusCount, updateOrderStatus } from "../../api/adminApiServices/ordersDataApi";
import { Variable } from "lucide-react";
import OrderStats from "../../components/admin/orders/OrderStatus";

export const useFetchAllOrders = (status) => {
    console.log('useFetchAllOrders hook called ,status:', status);
    const cleanStatus = (!status || status === 'All') ? undefined : status;
    return useInfiniteQuery({
        queryKey: ['admin-orders', cleanStatus],
        queryFn: ({ pageParam = null }) => {
            return fetchFullOrders({
                status: cleanStatus,
                limit: 10,
                cursor: pageParam
            })
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            console.log('last page :', lastPage);
            if (!lastPage?.pagination?.hasNextPage) return undefined;
            return lastPage?.pagination?.nextCursor ?? undefined;
        }

    })
}

export const useFetchOrdersCount = () => {
    return useQuery({
        queryKey: ['admin-orders-status-count'],
        queryFn: fetchOrderStatusCount,
        staleTime: 5 * 60 * 1000,
    })
}


export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['orderstatus-update'],
        mutationFn: ({ orderId, newStatus }) => updateOrderStatus(orderId, newStatus),
        onMutate: async ({ orderId, currentStatus, newStatus }) => {
            const cleanStatus = (!currentStatus || currentStatus === 'All') ? undefined : currentStatus;

            
            await queryClient.cancelQueries({ queryKey: ['admin-orders'] });

            const previousOrder = queryClient.getQueryData(['admin-orders', cleanStatus]);

            
            queryClient.setQueryData(['admin-orders', cleanStatus], (oldData) => {
               
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        orders: page.orders.map((order) =>
                            order.id === orderId
                                ? { ...order, orderStatus: newStatus }
                                : order
                        )
                    }))
                }
            })
            return { previousOrder, cleanStatus }
        },

        onError: (error, Variables, context) => {
            console.error('Order status update failed:', error);
            if (context?.previousOrder) {
                queryClient.setQueryData(['admin-orders', context.cleanStatus], context.previousOrder);
            }
        },
        onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        },
    })
}