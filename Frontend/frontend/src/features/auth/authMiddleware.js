import { logout, setCredentials } from './authSlice';
import { refreshToken } from './authService';

export const authMiddleware = (store) => (next) => async (action) => {
  if (action.type === 'auth/tryRefreshToken') {
    try {
      const accessToken = await refreshToken();
      store.dispatch(setCredentials({ accessToken }));
    } catch (e) {
      store.dispatch(logout());
    }
  }
  return next(action);
};