import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import _ from 'lodash';
import { Options } from 'vis-network';

export interface NodeLabel {
  type: string;
  field: string | undefined;
}

type OptionState = {
  nodeLabels: NodeLabel[];
  queryHistory: string[];
  isPhysicsEnabled: boolean;
  nodeLimit: number;
  networkOptions: Options;
};

const initialState: OptionState = {
  nodeLabels: [],
  queryHistory: [],
  isPhysicsEnabled: true,
  nodeLimit: 500,
  networkOptions: {
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.005,
        springLength: 230,
        springConstant: 0.18,
        avoidOverlap: 1.5,
      },
      maxVelocity: 40,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: false,
      // stabilization: {
      //   enabled: true,
      //   iterations: 500,
      //   updateInterval: 5,
      // },
    },
    // physics: {
    //   stabilization: false,
    //   barnesHut: {
    //     // gravitationalConstant: -80000,
    //     springConstant: 0.001,
    //     // springLength: 200,
    //   },
    // },
    layout: {
      randomSeed: '0.1030370700134704:1683151406408',
      improvedLayout: false,
    },
    interaction: {
      hideEdgesOnZoom: true,
    },
    // layout: {
    //   hierarchical: {
    //     enabled: true,
    //     direction: "UD",
    //     sortMethod: "directed",
    //   }
    // },
    nodes: {
      shape: 'dot',
      size: 20,
      borderWidth: 2,
      font: {
        size: 11,
      },
    },
    edges: {
      width: 2,
      font: {
        size: 11,
      },
      smooth: {
        type: 'dynamic',
      },
    },
  } as Options,
};

const slice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    setIsPhysicsEnabled: (state, action) => {
      state.isPhysicsEnabled = _.get(action, 'payload', true);
    },
    addQueryHistory: (state, action) => {
      state.queryHistory = [...state.queryHistory, action.payload];
    },
    clearQueryHistory: (state) => {
      state.queryHistory = [];
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
  addQueryHistory,
  clearQueryHistory,
  setNodeLabels,
  addNodeLabel,
  editNodeLabel,
  removeNodeLabel,
  setNodeLimit,
} = slice.actions;

const selectSelf = (state: RootState) => state
export const selectOptions = createSelector(selectSelf, (state) => state.options);
export default slice.reducer;
