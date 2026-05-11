import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary, getTopCustomers } from '../api/analytics.service'

export const useDashboardSummary = () => {
    return useQuery({
        queryFn: () => {
            return getDashboardSummary()
        },
        queryKey: ['dashboard', 'summary'],
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}

export const useTopCustomers = () => {
    return useQuery({
        queryFn: () => {
            return getTopCustomers()
        },
        queryKey: ['dashboard', 'top-customers'],
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}