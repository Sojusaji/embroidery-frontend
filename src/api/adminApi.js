import api from './axiosInstance';

export const fetchAdmins = async () => {
  const { data } = await api.get('/api/admin/admins');
  return data;
};

export const createAdmin = async (adminData) => {
  const { data } = await api.post('/api/admin/admins', adminData);
  return data;
};

export const deleteAdmin = async (id) => {
  const { data } = await api.delete(`/api/admin/admins/${id}`);
  return data;
};
