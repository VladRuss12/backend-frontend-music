import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  popular: {},
  loading: {},
  loaded: {},    
  error: {},
  liked: [],
  history: [],
  items: [] // <----- добавьте, если его ещё нет
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setPopular: (state, action) => {
      const { entityType, ids } = action.payload;
      state.popular[entityType] = ids;
    },
    setLoading: (state, action) => {
      const entityType = action.payload;
      state.loading[entityType] = true;
      state.error[entityType] = null;    
    },
    setLoaded: (state, action) => {
      const entityType = action.payload;
      state.loading[entityType] = false;
      state.loaded[entityType] = true;   
    },
    setError: (state, action) => {
      const entityType = action.payload?.entityType;
      const error = action.payload?.error;
      if (entityType) state.error[entityType] = error;
      state.loading[entityType] = false; 
      state.loaded[entityType] = false;  
    },
    setLiked: (state, action) => {
      if (state.liked !== action.payload) {
        state.liked = action.payload || [];
      }
    },
    setHistory: (state, action) => {   
      state.history = action.payload || [];
    },
    // --- добавьте этот редьюсер ---
    setRecommendations: (state, action) => {
      state.items = action.payload || [];
    }
  }
});

export const { setPopular, setLoading, setLoaded, setError, setLiked, setHistory, setRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;