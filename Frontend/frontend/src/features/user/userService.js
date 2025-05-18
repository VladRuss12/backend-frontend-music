import axiosInstance from '../../api/axiosInstance';

export const fetchUserProfile = async () => {
  const res = await axiosInstance.get('/users/me');
  return res.data;
};