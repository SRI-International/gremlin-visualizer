import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

const initialState = {
  isDialogOpen: false,
  type: null,
  properties: {},
  x: null,
  y: null,
  isNodeDialog : false,
  edgeFrom : null,
  edgeTo: null
};

const slice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state) => {
      state.isDialogOpen = true;
    },
    closeDialog: (state) => {
      state.isDialogOpen = false;
    },
    setCoordinates: (state, action) => {
      const { x, y } = action.payload;
      state.x = x;
      state.y = y;
    },
    setIsNodeDialog: (state, action) => {
      state.isNodeDialog = action.payload;
    },
    setEdgeFrom: (state, action) => {
      state.edgeFrom = action.payload;
    },
    setEdgeTo: (state, action) => {
      state.edgeTo = action.payload;
    }
  }
});

export const { openDialog, closeDialog, setCoordinates, setIsNodeDialog, setEdgeFrom, setEdgeTo } = slice.actions;
export const selectDialog = (state: RootState) => state.dialog;
export default slice.reducer;