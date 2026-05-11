import api from './axiosInstance';

export const getDashboardSummary = async () => {
  const { data } = await api.get('/api/admin/dashboard-summary');
  return data;
};

export const getTopCustomers = async () => {
  const { data } = await api.get('/api/admin/top-customers');
  return data;
};