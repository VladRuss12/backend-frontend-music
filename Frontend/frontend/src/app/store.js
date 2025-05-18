import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../features/user';     
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/aiChat';
import recommendationsReducer from '../features/recommendations/recommendationsSlice';
import tracksReducer from '../features/music/tracksSlice';
import { authMiddleware } from '../features/auth/authMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,           
    chat: chatReducer,
    tracks: tracksReducer,
    recommendations: recommendationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});