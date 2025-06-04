import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  popular: {},
  loading: {},
  loaded: {},
  error: {},
  liked: [],
  history: [],
  items: []
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setPopular: (state, action) => {
      const { entityType, recommendations } = action.payload;
      state.popular[entityType] = recommendations; // теперь тут массив объектов!
    },
    setLoading: (state, action) => {
      const mediaType = action.payload;
      state.loading[mediaType] = true;
      state.error[mediaType] = null;
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
      state.liked = action.payload || [];
    },
    setHistory: (state, action) => {
      state.history = action.payload || [];
    },
    setRecommendations: (state, action) => {
      state.items = action.payload || [];
    }
  }
});

export const { setPopular, setLoading, setLoaded, setError, setLiked, setHistory, setRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;