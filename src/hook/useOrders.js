import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logError } from "../utils/logger";
import {createOrder} from '../api/orderApi'



export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder(orderPayload),
        onSuccess:(data)=>{
          queryClient.invalidateQueries({queryKey:['cart']});
          queryClient.invalidateQueries({queryKey:['products']})
        },
        onError:(error)=>{
          logError('Order creation failed:', error);
        }
        
    })
}