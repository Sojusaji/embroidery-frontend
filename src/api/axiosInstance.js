import axios from "axios";
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const isAdminRoute = error.config?.url?.includes('/admin') || window.location.pathname.startsWith('/admin');

        if (error.response) {
            const { status, data } = error.response;
            const serverMessage = data.message || 'An unexpected error occurred.';

            switch (status) {
                case 400:
                    toast.error(`Validation Error: ${serverMessage}`, { id: 'validation-error' });
                    break;

                case 401:
                    toast.error(
                        isAdminRoute ? 'Admin session expired.' : 'Session expired.',
                        { id: 'auth-error' }
                    );
                    break;

                case 403:
                    toast.error('Access Denied: You do not have permission to perform this action.', { id: 'access-denied' });
                    break;

                case 500:
                    if (isAdminRoute) {
                        toast.error(`Server Error [500]: ${serverMessage}`, { duration: 6000, id: 'server-error' });
                    } else {
                        toast.error('Storefront encountered an issue. Please try again later.', { id: 'server-error', duration: 6000 });
                    }
                    break;

                default:
                    toast.error(serverMessage, { id: 'server-error', duration: 6000 });
            }
        } else if (error.request) {
            toast.error('Network Error: Cannot connect to server. Check your connection.', { id: 'network-error' });
        } else {
            toast.error(`Configuration Error: ${error.message}`, { id: 'configuration-error' });
        }

        return Promise.reject(error);
    }
);

export default api;