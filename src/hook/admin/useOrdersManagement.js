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
            console.log("orderId, currentStatus and newStatus:", orderId, currentStatus, newStatus);
            const cleanCurrentStatus = (!currentStatus || currentStatus === 'All') ? undefined : currentStatus;
            const cleanNewStatus = newStatus.toLowerCase();

            console.log('cleanStatus and cleanNewStatus', cleanCurrentStatus, cleanNewStatus);


            await queryClient.cancelQueries({ queryKey: ['admin-orders'] });
            await queryClient.cancelQueries({ queryKey: ['admin-orders-status-count'] });

            const previousOrder = queryClient.getQueryData(['admin-orders', cleanCurrentStatus]);
            // console.log('previousOrder list :', previousOrder);

            const previousTargetOrder = queryClient.getQueryData(['admin-orders', cleanNewStatus]);
            console.log('targetOrder:', previousTargetOrder);

            const previousStatusCounts = queryClient.getQueryData(['admin-orders-status-count']);
            console.log('targetOrder:', previousStatusCounts);

            console.log("All current cache keys:", queryClient.getQueryCache().getAll().map(q => q.queryKey));

            let newItem = null;
            queryClient.setQueryData(['admin-orders', cleanCurrentStatus], (oldData) => {
                // console.log("Old data:", oldData);
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        orders: page.orders.filter((order) => {
                            if (order.id === orderId) {
                                newItem = { ...order, orderStatus: newStatus }
                                return false;
                            }
                            return true;
                        })

                    }))
                };
            })
            queryClient.setQueryData(['admin-orders', cleanNewStatus], (targetOrder) => {
                if (!targetOrder) return targetOrder;
                return {
                    ...targetOrder,
                    pages: targetOrder.pages.map((page, pageIndex) => {
                        if (pageIndex === 0) {
                            return {
                                ...page,
                                orders: [
                                    newItem,
                                    ...page.orders
                                ]
                            }
                        }
                        return page;
                    })
                }
            })


            queryClient.setQueryData(['admin-orders-status-count'], (oldStatus) => {
                if (!oldStatus) return oldStatus;
                console.log("current orders count:", oldStatus.ordersCount[cleanCurrentStatus]);
                console.log("new orders count:", oldStatus.ordersCount[cleanNewStatus]);
                return {
                    ...oldStatus,
                    ordersCount: {
                        ...oldStatus.ordersCount,
                        [cleanCurrentStatus]: Math.max(0, (oldStatus.ordersCount[cleanCurrentStatus] || 0) - 1),
                        [cleanNewStatus]: Math.max(0, (oldStatus.ordersCount[cleanNewStatus] || 0) + 1)
                    }
                }
            })

            return { previousOrder, previousStatusCounts, previousTargetOrder, cleanCurrentStatus, cleanNewStatus }
        },

        onError: (error, Variables, context) => {
            console.error('Order status update failed:', error);
            if (context?.previousOrder !== undefined) {
                queryClient.setQueryData(['admin-orders', context.cleanCurrentStatus], context.previousOrder);
            }
            if (context?.previousStatusCounts !== undefined) {
                queryClient.setQueryData(['admin-orders-status-count'], context.previousStatusCounts);
            }
            if (context?.previousTargetOrder !== undefined) {
                queryClient.setQueryData(['admin-orders', context.cleanNewStatus], context.previousTargetOrder);
            }
        },
        onSettled: (data, error, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-orders-status-count'] });
        },
    })
}