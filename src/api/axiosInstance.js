import axios from "axios";
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 30000, // 30 seconds timeout
})

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const isAdminRoute = error.config?.url?.includes('/admin') || window.location.pathname.startsWith('/admin');

        // Handle specific Axios Errors
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            toast.error('Request timed out. Please try again.', { id: 'network-timeout' });
            return Promise.reject(error);
        }

        if (error.response) {
            const { status, data } = error.response;
            const serverMessage = data.message || 'An unexpected error occurred.';

            switch (status) {
                case 400:
                    // Clean format for standard bad requests
                    toast.error(serverMessage, { id: `error-400-${serverMessage.substring(0, 10)}` });
                    break;

                case 401:
                    toast.error(
                        isAdminRoute ? 'Admin session expired. Please log in.' : 'Session expired. Please log in.',
                        { id: 'auth-error' }
                    );
                    // Optionally, trigger a redirect to login here if absolutely necessary
                    break;

                case 403:
                    toast.error('Access Denied: You do not have permission to perform this action.', { id: 'access-denied' });
                    break;
                
                case 404:
                    toast.error('Requested resource was not found.', { id: 'not-found' });
                    break;

                case 500:
                    if (isAdminRoute) {
                        toast.error(`Server Error: ${serverMessage}`, { duration: 6000, id: 'server-error' });
                    } else {
                        // User-friendly message for storefront
                        toast.error('Our servers are currently experiencing issues. Please try again later.', { id: 'server-error', duration: 6000 });
                    }
                    break;

                default:
                    toast.error(serverMessage || 'Oops! Something went wrong.', { id: 'generic-error', duration: 6000 });
            }
        } else if (error.request) {
            // Request was made but no response received (Network error, CORS, API down)
            toast.error('Network Error: Cannot connect to our servers. Check your internet connection.', { id: 'network-error' });
        } else {
            // Something happened in setting up the request
            toast.error(`Application Error: ${error.message}`, { id: 'configuration-error' });
        }

        // Standardize the rejected data so components can safely catch it
        const rejectError = error.response?.data || { message: error.message };
        return Promise.reject(rejectError);
    }
);

export default api;