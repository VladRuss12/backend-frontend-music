import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  popular: {},
  loading: {},
  error: {},
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
    },
    setLoaded: (state, action) => {
      const entityType = action.payload;
      state.loading[entityType] = false;
    },
    setError: (state, action) => {
      const { entityType, error } = action.payload;
      state.error[entityType] = error;
    },
  }
});

export const { setPopular, setLoading, setLoaded, setError } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;