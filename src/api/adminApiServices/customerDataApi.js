import api from '../axiosInstance';


export const fetchCustomerData = async () => {
    console.log('fetchCustomerData api function working');
    const { data } = await api.get('/api/v1/admins/customer');
    console.log('fetched customer data:', data);
    return data?.users;
}