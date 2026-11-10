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


export const updateOrderStatus = async ({ status, id }) => {
  try {
    const { data } = await api.patch(`/api/v1/admins/orders/${id}`, { orderStatus: status });
    return data;
  } catch (error) {
    console.log('order status update error:', error);
  }
}