import api from '../axiosInstance';


export const fetchCustomerData = async () => {
    const { data } = await api.get('/api/v1/admins/customer');
    return data?.users;
}

export const blockCustomer = async ({customerId, status}) => {
    console.log('status and id :',customerId,status);
    const { data } = await api.patch(`/api/v1/admins/customer/${customerId}/block`, {
        status
    });
    return data;
}

export const deleteCustomer = async (customerId) => {
    const { data } = await api.delete(`/api/v1/admins/customer/${customerId}/delete`);
    return data;
}