import axiosInstance from './axiosInstance.js';
import { setCredentials } from '../features/auth/authSlice'; 

export const register = async (data) => {
  const res = await axiosInstance.post('/auth/register', data);
  return res.data;
};

export const login = async (data) => {
  const res = await axiosInstance.post('/auth/login', data);
  const { access_token, refresh_token, token_type } = res.data;

  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  localStorage.setItem('token_type', token_type);

  const meRes = await axiosInstance.get('/users/me');
  if (meRes.data.id) {
    localStorage.setItem('user_id', meRes.data.id);
  } else if (meRes.data.user_id) {
    localStorage.setItem('user_id', meRes.data.user_id);
  } else {
    console.error("Не найден id или user_id в данных пользователя:", meRes.data);
  }

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    user: meRes.data,
  };
};

export const initializeAuth = async (dispatch) => {
  const token = localStorage.getItem('access_token'); 
  if (!token) return;

  try {
    const response = await axiosInstance.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch(setCredentials({accessToken: token, user: response.data }));
  } catch (err) {
    console.error("Ошибка при инициализации токена:", err);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
  }
};
