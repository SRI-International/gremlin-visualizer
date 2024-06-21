import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { DIALOG_TYPES } from "../components/ModalDialog/ModalDialogComponent";

export interface Suggestions {
  [dialogType : string] : {
    types : string[]
    labels : {[label: string] : string[]}
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
  suggestions: Suggestions;
}

const initialState: DialogState = {
  isDialogOpen: false,
  dialogType: '',
  properties: {},
  x: null,
  y: null,
  edgeFrom: null,
  edgeTo: null,
  suggestions: {},
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
      const suggestions = action.payload as Suggestions;

      Object.entries(suggestions).forEach(([dialogType, elementSuggestions]) => {
        if (!state.suggestions[dialogType]) {
          state.suggestions[dialogType] = {
            types: [],
            labels : {}
          };
        }

        Object.entries(elementSuggestions.labels).forEach(([label, fields]) => {
          const tempSet = new Set(state.suggestions[dialogType].labels[label]);
          fields.forEach(fields => {
            tempSet.add(fields);
          });
          state.suggestions[dialogType].labels[label] = Array.from(tempSet);
        });

        const tempSet = new Set(state.suggestions[dialogType].types);
        elementSuggestions.types.forEach((type) => {
          tempSet.add(type);
        });
        state.suggestions[dialogType].types = Array.from(tempSet);
      });
    }

  }
})


export const { openNodeDialog, openEdgeDialog, closeDialog, setDialogType, setSuggestions } = slice.actions;
export const selectDialog = (state: RootState) => state.dialog;
export default slice.reducer;