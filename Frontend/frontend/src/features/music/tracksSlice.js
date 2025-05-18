import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entities: {}, // { [id]: track }
  loading: false,
  error: null,
};

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setTrack: (state, action) => {
      const track = action.payload;
      state.entities[track.id] = track;
    },
    setTracksLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTracksError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTrack, setTracksLoading, setTracksError } = tracksSlice.actions;
export default tracksSlice.reducer;