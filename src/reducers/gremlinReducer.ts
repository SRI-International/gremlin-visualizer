import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';


type GremlinState = {
  queryHistory: string[];
  queryBase: string;
  error?: string | null;
};

const initialState: GremlinState = {
  queryBase: 'g',
  queryHistory: [],
  error: null
};

const slice = createSlice({
  name: 'gremlin',
  initialState,
  reducers: {
    addQueryHistory: (state, action) => {
      state.queryHistory = [...state.queryHistory, action.payload];
    },
    clearQueryHistory: (state) => {
      state.queryHistory = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setQueryBase: (state, action) => {
      state.queryBase = action.payload;
    },
  }
});

export const { addQueryHistory, clearQueryHistory, setError, setQueryBase } = slice.actions;
const selectSelf = (state: RootState) => state;
export const selectGremlin = createSelector(selectSelf, (state) => state.gremlin);
export default slice.reducer;