import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {fetchCustomerData } from "../../api/adminApiServices/customerDataApi";

export const useFetchCutomerData = () => {
    console.log('useFetchCutomerData function working');
    return useQuery({
        queryKey: ['customer'],
        queryFn: fetchCustomerData,
        staleTime: 5 * 60 * 1000,
        
    })
    
}