import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { DIALOG_TYPES } from "../components/ModalDialog/ModalDialogComponent";

export interface FieldSuggestions {
  [dialogType : string] : {
    [label: string] : string[];
  }
}

interface DialogState {
  isDialogOpen: boolean;
  dialogType: string;
  properties: Record<string, any>;
  x: number | null;
  y: number | null;
  edgeFrom: string | null;
  edgeTo: string | null;
  fieldSuggestions: FieldSuggestions;
}

const initialState: DialogState = {
  isDialogOpen: false,
  dialogType: '',
  properties: {},
  x: null,
  y: null,
  edgeFrom: null,
  edgeTo: null,
  fieldSuggestions: {}
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
    },
    setSuggestions: (state, action) => {
      const fieldSuggestions = action.payload as FieldSuggestions;
      Object.entries(fieldSuggestions).forEach(([dialogType, labels]) => {
        if (!state.fieldSuggestions[dialogType]) {
          state.fieldSuggestions[dialogType] = {};
        }
        Object.entries(labels).forEach(([label, suggestionsArray]) => {
          if (!state.fieldSuggestions[dialogType][label]) {
            state.fieldSuggestions[dialogType][label] = [];
          }
          const tempSet = new Set(state.fieldSuggestions[dialogType][label]);
          suggestionsArray.forEach(suggestion => {
            tempSet.add(suggestion);
          });
          state.fieldSuggestions[dialogType][label] = Array.from(tempSet);
        });
      });
    }
  }
});

export const { openNodeDialog, openEdgeDialog, closeDialog, setDialogType, setSuggestions } = slice.actions;
export const selectDialog = (state: RootState) => state.dialog;
export default slice.reducer;