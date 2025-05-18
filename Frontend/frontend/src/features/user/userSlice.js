import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => { state.profile = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    clearProfile: (state) => { state.profile = null; },
  },
});

export const { setProfile, setLoading, setError, clearProfile } = userSlice.actions;
export default userSlice.reducer;