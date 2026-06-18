import api from './axiosInstance';

export const fetchAdmins = async () => {
  const { data } = await api.get('/api/v1/admins');
  return data;
};

export const createAdmin = async (adminData) => {
  const { data } = await api.post('/api/v1/admins', adminData);
  return data;
};

export const deleteAdmin = async (id) => {
  const { data } = await api.delete(`/api/v1/admins/${id}`);
  return data;
};


