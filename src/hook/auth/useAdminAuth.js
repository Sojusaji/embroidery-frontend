// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { useNavigate } from "react-router-dom"
// import { adminLogin, adminLogout } from "../../api/authApi/adminAuthApi.js";


// // export const useAdminAuth = () => {
// //     return useQuery({
// //         queryKey: ['adminAuthStatus'],
// //         queryFn: async () => {
// //             const { data } = await adminAuthStatus();
// //             return data;
// //         },
// //         retry: false
// //     })
// // }

// export const useAdminLogout = () => {
//     const queryClient = useQueryClient();
//     const navigate = useNavigate();

//     return useMutation({
//         mutationFn: adminLogout,
//         onSuccess: () => {
//             queryClient.setQueryData(['adminAuthStatus'], null);
//             queryClient.clear();
//             navigate('/admin/login', { replace: true });
//         },
//         onError: (error) => {
//             console.error('Logout failed:', error.message);
//         }
//     });
// };

// export const useAdminLogin = () => {
//     const queryClient = useQueryClient();
//     const navigate = useNavigate()
//     return useMutation({
//         mutationFn: adminLogin,
//         mutationKey: ['admin-login'],

//         onSuccess: (data) => {
//             console.log('Login successful kdjksjfjsljsjdflks', data);
//             queryClient.invalidateQueries({ queryKey: ['adminAuthStatus'] })
//             navigate('/admin', { replace: true });
//         },
//         onError: (error) => {
//             const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';
//             console.error('Admin login failed:', errorMessage);
//         }
//     })
// }

