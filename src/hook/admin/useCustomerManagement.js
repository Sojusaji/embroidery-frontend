import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomerData, blockCustomer, deleteCustomer } from "../../api/adminApiServices/customerDataApi";
import { logError } from "../../utils/logger";

export const useFetchCutomerData = () => {
    console.log('useFetchCutomerData function working');
    return useQuery({
        queryKey: ['customer'],
        queryFn: fetchCustomerData,
        staleTime: 5 * 60 * 1000,

    })
}

export const useBlockCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: blockCustomer,
        onMutate: async (customerId) => {
            await queryClient.cancelQueries({ queryKey: ['customer'] });
            const previousCustomerData = queryClient.getQueryData(['customer']);
            if (!previousCustomerData) return { previousCustomerData: [] };

            queryClient.setQueryData(['customer'], (oldData) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map((customer) => {
                    const id = customer?._id || customer?.id;
                    if (id === customerId) {
                        const updatedStatus = customer.status === "active" ? "blocked" : "active";
                        return {
                            ...customer,
                            status: updatedStatus
                        };
                    }
                    return customer;
                })


            })
            return { previousCustomerData };
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] });
        },

        onError: (error, variables, context) => {
            if (context?.previousCustomerData) {
                queryClient.setQueryData(['customer'], context?.previousCustomerData);
                logError("Error occured during customer blocking stage", error);
            }
        }

    })
}



export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCustomer,
        onMutate: async (customerId) => {
            await queryClient.cancelQueries({ queryKey: ['customer'] });
            const previousCustomerData = queryClient.getQueryData(['customer']);
            if (!previousCustomerData) return { previousCustomerData: [] };

            queryClient.setQueryData(['customer'], (oldData) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.filter((customer) => {
                    const id = customer?._id || customer?.id;
                    return id !== customerId;
                })
            })
            return { previousCustomerData };
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['customer'] });
        },

        onError: (error, variables, context) => {
            if (context?.previousCustomerData) {
                queryClient.setQueryData(['customer'], context?.previousCustomerData);
                logError("Error occured during customer deleting stage", error);
            }
        }

    })
}
