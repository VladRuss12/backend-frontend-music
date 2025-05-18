import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],       
  popular: [],     
  history: [],
  liked: [],
  loading: false,
  error: null,
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendations: (state, action) => { state.items = action.payload; },
    setPopular: (state, action) => { state.popular = action.payload; },
    setHistory: (state, action) => { state.history = action.payload; },
    setLiked: (state, action) => { state.liked = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setRecommendations, setPopular, setHistory, setLiked, setLoading, setError } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;