import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
  loading: false,
  error: null,
};

const streamSlice = createSlice({
  name: 'stream',
  initialState,
  reducers: {
    setFiles: (state, action) => { state.files = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  }
});

export const { setFiles, setLoading, setError } = streamSlice.actions;
export default streamSlice.reducer;