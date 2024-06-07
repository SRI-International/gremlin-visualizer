import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import _ from 'lodash';
import { Options } from 'vis-network';
import { INITIAL_LABEL_MAPPINGS } from '../constants';

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

const initialNodeLabels: NodeLabel[] = Object.entries(INITIAL_LABEL_MAPPINGS).map(([type, field]) => 
  ({ type: type.split('_')[0].toLowerCase(), field }));

const initialState: OptionState = {
  nodeLabels: initialNodeLabels,
  queryHistory: [],
  isPhysicsEnabled: true,
  nodeLimit: 100,
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
      stabilization: {
        enabled: true,
        iterations: 50,
        updateInterval: 25,
      },
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

export const selectOptions = (state: RootState) => state.options;
export default slice.reducer;

// export const reducer =  (state=initialState, action)=>{
//   switch (action.type){
//     case ACTIONS.SET_IS_PHYSICS_ENABLED: {
//       const isPhysicsEnabled = _.get(action, 'payload', true);
//       return { ...state, isPhysicsEnabled };
//     }
//     case ACTIONS.ADD_QUERY_HISTORY: {
//       return { ...state, queryHistory: [ ...state.queryHistory, action.payload] }
//     }
//     case ACTIONS.CLEAR_QUERY_HISTORY: {
//       return { ...state, queryHistory: [] }
//     }
//     case ACTIONS.SET_NODE_LABELS: {
//       const nodeLabels = _.get(action, 'payload', []);
//       return { ...state, nodeLabels };
//     }
//     case ACTIONS.ADD_NODE_LABEL: {
//       const nodeLabels = [...state.nodeLabels, {}];
//       return { ...state, nodeLabels };
//     }
//     case ACTIONS.EDIT_NODE_LABEL: {
//       const editIndex = action.payload.id;
//       const editedNodeLabel = action.payload.nodeLabel;

//       if (state.nodeLabels[editIndex]) {
//         const nodeLabels = [...state.nodeLabels.slice(0, editIndex), editedNodeLabel, ...state.nodeLabels.slice(editIndex+1)];
//         return { ...state, nodeLabels };
//       }
//       return state;
//     }
//     case ACTIONS.REMOVE_NODE_LABEL: {
//       const removeIndex = action.payload;
//       if (removeIndex < state.nodeLabels.length) {
//         const nodeLabels = [...state.nodeLabels.slice(0, removeIndex), ...state.nodeLabels.slice(removeIndex+1)];
//         return { ...state, nodeLabels };
//       }
//       return state;
//     }
//     case ACTIONS.SET_NODE_LIMIT: {
//       const nodeLimit = action.payload;
//       return { ...state, nodeLimit };
//     }
//     default:
//       return state;
//   }
// };
