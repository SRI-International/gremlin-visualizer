// import vis from 'vis-network';
import { createSlice } from '@reduxjs/toolkit';
import { Edge, Node } from 'vis-network';
import { RootState } from '../app/store';
import _ from 'lodash';

type GraphState = {
  nodes: Node[];
  edges: Edge[];
  selectedNode?: Node;
  selectedEdge?: Edge;
  nodeColorMap: { [index: string]: string };
};
const initialState: GraphState = {
  nodes: [],
  edges: [],
  selectedNode: {},
  selectedEdge: {},
  nodeColorMap: {},
};

const slice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    clearGraph: (state) => {
      state = Object.assign({}, state);
      state.nodes = [];
      state.edges = [];
      state.selectedNode = {};
      state.selectedEdge = {};
      return state;
    },
    addNodes: (state, action) => {
      state = Object.assign({}, state);
      const newNodes = _.differenceBy(action.payload, state.nodes, (node: any) => node.id);
      state.nodes = [...state.nodes, ...newNodes];
      return state;
    },
    addEdges: (state, action) => {
      state = Object.assign({}, state);
      const newEdges = _.differenceBy(action.payload, state.edges, (edge: any) => `${edge.from},${edge.to}`);
      state.edges = [...state.edges, ...newEdges];
      return state;
    },
    setSelectedNode: (state, action) => {
      const nodeId = action.payload;
      state = Object.assign({}, state);
      if (nodeId !== null) {
        state.selectedNode = _.find(state.nodes, node => node.id == nodeId);
      }
      state.selectedEdge = {};
      return state;
    },
    setSelectedEdge: (state, action) => {
      const edgeId = action.payload;
      state = Object.assign({}, state);
      if (edgeId !== null) {
        state.selectedEdge = _.find(state.edges, edge => edge.id === edgeId);
      }
      state.selectedNode = {};
      return state;
    },
    refreshNodeLabels: (state, action) => {
      const nodeLabelMap = _.mapValues(_.keyBy(action.payload, 'type'), 'field');
      state = Object.assign({}, state);
      state.nodes = state.nodes.map((node: any) => {
        if (node.type in nodeLabelMap) {
          const field = nodeLabelMap[node.type];
          const label = node.properties[field];
          return { ...node, label };
        }
        return node;
      });
      return state;
    },
    updateColorMap: (state, action) => {
      Object.assign(state.nodeColorMap, action.payload);
    }
  },
});

export const {
  clearGraph,
  addNodes,
  addEdges,
  setSelectedEdge,
  setSelectedNode,
  refreshNodeLabels,
  updateColorMap
} = slice.actions;

export const selectGraph = (state: RootState) => state.graph;

export default slice.reducer;
