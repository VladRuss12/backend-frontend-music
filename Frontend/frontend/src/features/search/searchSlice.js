import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchAllEntities, searchEntities } from './searchService';

export const searchAll = createAsyncThunk(
  'search/searchAll',
  async (query) => {
    const data = await searchAllEntities(query);
    return data;
  }
);

export const searchByType = createAsyncThunk(
  'search/searchByType',
  async ({ entityType, query }) => {
    const data = await searchEntities(entityType, query);
    return { entityType, data };
  }
);

const initialState = {
  query: '',
  results: {
    playlists: [],
    tracks: [],
    performers: []
  },
  loading: false,
  error: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch(state) {
      state.query = '';
      state.results = { playlists: [], tracks: [], performers: [] };
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByType.fulfilled, (state, action) => {
        const { entityType, data } = action.payload;
        state.loading = false;
        state.results[entityType] = data;
      })
      .addCase(searchByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;