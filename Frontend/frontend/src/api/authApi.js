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

  return res.data;
};

export const initializeAuth = async (dispatch) => {
  const token = localStorage.getItem('access_token'); 
  if (!token) return;

  try {
    const response = await axiosInstance.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch(setCredentials({ token, user: response.data }));
  } catch (err) {
    console.error("Ошибка при инициализации токена:", err);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
  }
};
