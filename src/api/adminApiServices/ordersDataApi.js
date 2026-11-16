import api from "../../api/axiosInstance";

export const fetchFullOrders = async ({ status, limit = 10, cursor } = {}) => {

  try {

    const { data } = await api.get('/api/v1/admins/orders', {
      params: {
        status,
        limit,
        cursor
      }
    });
    console.log('full orders :', data);
    return data;
  } catch (error) {
    console.log('error of allOrders:', error);
  }
}


export const fetchOrderStatusCount = async () => {
  try {
    const { data } = await api.get('/api/v1/admins/orders-count');
    return data;
  } catch (error) {
    console.log('fetchOrderStatusCount error', error);
  }
}


export const updateOrderStatus = async (id, newStatus) => {
  console.log('status and order ID:', id, newStatus);
  try {
    // const { data } = await api.patch(`/api/v1/admins/orders/${id}`, { newStatus });
    // console.log('updated order stats data:', data);
    // return data;
  } catch (error) {
    console.log('order status update error:', error);
  }
}