import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken; 
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refreshToken); 
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null; 
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
