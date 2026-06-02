import axios from "axios";
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

let isAuthToastVisible = false;

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
                    toast.error(`Validation Error: ${serverMessage}`);
                    break;

                case 401:
                    if (!isAuthToastVisible) {
                        isAuthToastVisible = true;

                        if (isAdminRoute) {
                            toast.error('Admin session expired. Access revoked.', { id: 'auth-error' });
                        } else {
                            toast.error('Your session has expired. Please log in again to continue.', { id: 'auth-error' });
                        }

                        // try {
                        // Call your backend logout endpoint so the server clears the httpOnly cookie
                        // using res.clearCookie('token')
                        //   await axios.post('/api/auth/logout', {}, { withCredentials: true });
                        // } catch (logoutError) {
                        //   console.error('Failed to clear session cookie cleanly:', logoutError);
                        // }

                        // Optional: If you use a custom event or a state manager like TanStack Query/Zustand,
                        // you can trigger a state reset here:
                        // window.dispatchEvent(new Event('user-logged-out'));

                        //     setTimeout(() => {
                        //       isAuthToastVisible = false;
                        //     }, 3000);
                    }
                    break;

                case 403:
                    toast.error('Access Denied: You do not have permission to perform this action.');
                    break;

                case 500:
                    if (isAdminRoute) {
                        toast.error(`Server Error [500]: ${serverMessage}`, { duration: 6000 });
                    } else {
                        toast.error('Storefront encountered an issue. Please try again later.');
                    }
                    break;

                default:
                    toast.error(serverMessage);
            }
        } else if (error.request) {
            // Handles network down/timeout
            toast.error('Network Error: Cannot connect to server. Check your connection.');
        } else {
            toast.error(`Configuration Error: ${error.message}`);
        }

        // Always reject the promise so calling components can terminate their local loading spinners
        return Promise.reject(error);
    }
);

export default api;