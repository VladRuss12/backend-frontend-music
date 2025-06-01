import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../features/user';     
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/aiChat';
import recommendationsReducer from '../features/recommendations/recommendationsSlice';
import entitiesReducer from '../features/music/entitiesSlice';
import searchReducer from '../features/search/searchSlice';
import streamReducer from "../features/streaming/streamSlice";
import { authMiddleware } from '../features/auth/authMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,           
    chat: chatReducer,
    entities: entitiesReducer,
    search: searchReducer,
    recommendations: recommendationsReducer,
    stream: streamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});