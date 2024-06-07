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
    /** I wonder why there are returns in this function? It doesn't seem to be doing anything */
    refreshNodeLabels: (state, action) => {
      console.log("refreshNodeLabels reducer entered");
      console.log(state);
      console.log(action);
      const nodeLabelMap = _.mapValues(_.keyBy(action.payload, 'type'), 'field');
      state.nodes.map((node: any) => {
        if (node.type in nodeLabelMap) {
          const field = nodeLabelMap[node.type];
          const label = node.properties[field];
          console.log('field :' + field +  "label: " + label);
          console.log(node)
          node.label = label;
          // return { ...node, label }; 
        }
        console.log("return node");
        // return node;
      });
      console.log("return state");
      // return state;
    },
  },
});

export const {
  clearGraph,
  addNodes,
  addEdges,
  setSelectedEdge,
  setSelectedNode,
  refreshNodeLabels,
} = slice.actions;

export const selectGraph = (state: RootState) => state.graph;

export default slice.reducer;
