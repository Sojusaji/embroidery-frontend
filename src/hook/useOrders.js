import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logError } from "../utils/logger";
import {createOrder ,fetchOrders} from '../api/orderApi'


export const useFetchOrders =()=>{
   return useQuery({
       queryKey:['orders'],
       queryFn: fetchOrders,

   })
}


export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(orderPayload)=>createOrder(orderPayload),
        onSuccess:(data)=>{
          queryClient.invalidateQueries({queryKey:['cart']});
          queryClient.invalidateQueries({queryKey:['products']})
        },
        onError:(error)=>{
          logError('Order creation failed:', error);
        }
        
    })
}