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
};
const initialState: GraphState = {
  nodes: [],
  edges: [],
  selectedNode: {},
  selectedEdge: {},
};

const slice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    clearGraph: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNode = {};
      state.selectedEdge = {};
    },
    addNodes: (state, action) => {
      const newNodes = _.differenceBy(action.payload, state.nodes, (node: any) => node.id);
      state.nodes = [...state.nodes, ...newNodes];
    },
    updateNode: (state, action) => {
      const { updateId, updatedElement } = action.payload;
      const stateNodeIndex = state.nodes.findIndex(node => node.id === updateId);
      if (stateNodeIndex !== -1) {
        state.nodes[stateNodeIndex] = { ...state.nodes[stateNodeIndex], ...updatedElement};
        state.selectedNode = updatedElement;
      } else {
        console.error("Node not found in state or updatedNodes");
      }
    },
    updateEdge: (state, action) => {
      const { updateId, updatedElement } = action.payload;
      const stateEdgeIndex = state.edges.findIndex(edge => edge.id === updateId);
      if (stateEdgeIndex !== -1) {
        state.edges[stateEdgeIndex] = { ...state.edges[stateEdgeIndex], ...updatedElement};
        state.selectedEdge = updatedElement;
      } else {
        console.error("Edge not found in state or updatedNodes");
      }
    },
    addEdges: (state, action) => {
      const newEdges = _.differenceBy(action.payload, state.edges, (edge: any) => `${edge.from},${edge.to}`);
      state.edges = [...state.edges, ...newEdges];
    },
    setSelectedNode: (state, action) => {
      const nodeId = action.payload;
      if (nodeId !== null) {
        state.selectedNode = _.find(state.nodes, node => node.id === nodeId);
      }
      state.selectedEdge = {};
    },
    setSelectedEdge: (state, action) => {
      const edgeId = action.payload;
      if (edgeId !== null) {
        state.selectedEdge = _.find(state.edges, edge => edge.id === edgeId);
      }
      state.selectedNode = {};
    },
    refreshNodeLabels: (state, action) => {
      const nodeLabelMap = _.mapValues(_.keyBy(action.payload, 'type'), 'field');
      const newState = Object.assign({}, state);
      newState.nodes = newState.nodes.map((node: any) => {
        if (node.type in nodeLabelMap) {
          const field = nodeLabelMap[node.type];
          const label = node.properties[field];
          return { ...node, label };
        }
        return node;
      });
      return newState;
    },
  },
});

export const {
  clearGraph,
  updateNode,
  updateEdge,
  addNodes,
  addEdges,
  setSelectedEdge,
  setSelectedNode,
  refreshNodeLabels,
} = slice.actions;

export const selectGraph = (state: RootState) => state.graph;

export default slice.reducer;
