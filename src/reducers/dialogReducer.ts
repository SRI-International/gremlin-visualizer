import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { DIALOG_TYPES } from "../components/ModalDialog/ModalDialogComponent";

const initialState = {
  isDialogOpen: false,
  dialogType: '',
  properties: {},
  x: null,
  y: null,
  edgeFrom: null,
  edgeTo: null
};

const slice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openNodeDialog: (state, action) => {
      const { x, y } = action.payload;
      state.x = x;
      state.y = y;
      state.dialogType = DIALOG_TYPES.NODE
      state.isDialogOpen = true;
    },
    openEdgeDialog: (state, action) => {
      const { edgeFrom, edgeTo } = action.payload;
      state.edgeFrom = edgeFrom;
      state.edgeTo = edgeTo;
      state.dialogType = DIALOG_TYPES.EDGE;
      state.isDialogOpen = true;
    },
    closeDialog: (state) => {
      state.isDialogOpen = false;
    },
    setDialogType: (state, action) => {
      state.dialogType = action.payload;
    }
  }
});

export const { openNodeDialog, openEdgeDialog, closeDialog, setDialogType } = slice.actions;
export const selectDialog = (state: RootState) => state.dialog;
export default slice.reducer;