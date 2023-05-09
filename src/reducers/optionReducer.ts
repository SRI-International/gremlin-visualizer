import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import _ from 'lodash';

export interface NodeLabel {
  type: string;
  field: string | undefined;
}

type OptionState = {
  nodeLabels: NodeLabel[];
  isPhysicsEnabled: boolean;
  nodeLimit: number;
};

const initialState: OptionState = {
  nodeLabels: [],
  isPhysicsEnabled: true,
  nodeLimit: 500,
};

const slice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    setIsPhysicsEnabled: (state, action) => {
      state.isPhysicsEnabled = _.get(action, 'payload', true);
    },
    setNodeLabels: (state, action) => {
      state.nodeLabels = _.get(action, 'payload', []);
    },
    addNodeLabel: (state) => {
      state.nodeLabels = [...state.nodeLabels, { type: '', field: '' }];
    },
    editNodeLabel: (state, action) => {
      const editIndex = action.payload.id;
      const editedNodeLabel = action.payload.nodeLabel;

      if (state.nodeLabels[editIndex]) {
        state.nodeLabels = [
          ...state.nodeLabels.slice(0, editIndex),
          editedNodeLabel,
          ...state.nodeLabels.slice(editIndex + 1),
        ];
      }
    },
    removeNodeLabel: (state, action) => {
      const removeIndex = action.payload;
      if (removeIndex < state.nodeLabels.length) {
        state.nodeLabels = [
          ...state.nodeLabels.slice(0, removeIndex),
          ...state.nodeLabels.slice(removeIndex + 1),
        ];
      }
    },
    setNodeLimit: (state, action) => {
      state.nodeLimit = action.payload;
    },
  },
});

export const {
  setIsPhysicsEnabled,
  setNodeLabels,
  addNodeLabel,
  editNodeLabel,
  removeNodeLabel,
  setNodeLimit,
} = slice.actions;

const selectSelf = (state: RootState) => state
export const selectOptions = createSelector(selectSelf, (state) => state.options);
export default slice.reducer;
