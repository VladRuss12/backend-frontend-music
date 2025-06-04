import axiosInstance from '../../api/axiosInstance'; // скорректируй путь, если нужно

// Регистрация пользователя
export const register = async (data) => {
  const res = await axiosInstance.post('/auth/register', data);
  return res.data;
};

// Вход пользователя
export const login = async ({ email, password }) => {
  const res = await axiosInstance.post('/auth/login', { email, password });
  const { access_token, refresh_token, token_type } = res.data;

  // Сохраняем токены в localStorage
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  localStorage.setItem('token_type', token_type);

  // Получаем профиль пользователя
  const meRes = await axiosInstance.get('/users/me');
  const userId = meRes.data.id || meRes.data.user_id;
  if (userId) {
    localStorage.setItem('user_id', userId);
  } else {
    console.error('Не найден id или user_id в данных пользователя:', meRes.data);
  }

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    user: meRes.data,
  };
};

// Обновление access токена через refresh токен
export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) throw new Error('Нет refresh_token');
  const res = await axiosInstance.post('/auth/refresh', { refresh_token });
  const { access_token } = res.data;
  localStorage.setItem('access_token', access_token);
  return access_token;
};

// Получение профиля пользователя
export const getProfile = async () => {
  const res = await axiosInstance.get('/users/me');
  return res.data;
};

// Инициализация авторизации при запуске приложения
export const initializeAuth = async (dispatch, setCredentials) => {
  const token = localStorage.getItem('access_token');
  if (!token) return;

  try {
    const user = await getProfile();
    dispatch(setCredentials({ accessToken: token, user }));
  } catch (err) {
    console.error('Ошибка при инициализации токена:', err);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
  }
};