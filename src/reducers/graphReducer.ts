// import vis from 'vis-network';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { Edge, Node } from 'vis-network';
import { RootState } from '../app/store';
import _ from 'lodash';
import { NodeData } from '../logics/utils';

type Coordinates = {
  x: number;
  y: number;
};

type GraphState = {
  nodes: NodeData[];
  edges: Edge[];
  selectedNode?: Node;
  selectedEdge?: Edge;
  selectedLayout?: string;
  group: string;
  layouts: LayoutNames;
  layoutChanged: boolean;
};

type LayoutsMap = {
  [group: string]: LayoutJson;
};

type NodePositions = {
  [key: string]: Coordinates;
};

type LayoutNames = {
  [name: string]: NodePositions;
};

type LayoutJson = {
  [name: string]: Coordinates;
};

const initialState: GraphState = {
  nodes: [],
  edges: [],
  selectedNode: {},
  selectedEdge: {},
  group: 'default',
  layouts: {},
  layoutChanged: false,
};

const slice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    addEdges: (state, action) => {
      const newEdges = _.differenceBy(action.payload, state.edges, (edge: any) => `${edge.from},${edge.to}`);
      state.edges = [...state.edges, ...newEdges];
    },
    addNodes: (state, action) => {
      const newNodes = _.differenceBy(action.payload, state.nodes, (node: any) => node.id);
      state.nodes = [...state.nodes, ...newNodes];
    },
    clearGraph: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNode = {};
      state.selectedEdge = {};
      state.group = 'default';
      state.selectedLayout = undefined;
      state.layoutChanged = false;
    },
    saveLayout: (state, action) => {
      const { name } = action.payload;
      state.layouts[name] = action.payload;
      // state.layouts(action.payload);
    },
    setGraphGroup: (state, action) => {
      state.group = action.payload;
    },
    setLayoutChanged: (state, action) => {
      state.layoutChanged = action.payload;
    },
    setNodePositions: (state, action) => {
      if (state.nodes.length > 0) {
        const nodes = action.payload;
        const keys = Object.keys(nodes);

        for (let id of keys) {
          const ndx = state.nodes.findIndex(n => n.uniqueId === id);
          state.nodes[ndx].x = nodes[id].x;
          state.nodes[ndx].y = nodes[id].y;
        }
      }
    },
    setSelectedEdge: (state, action) => {
      const edgeId = action.payload;
      if (edgeId !== null) {
        state.selectedEdge = _.find(state.edges, edge => edge.id === edgeId);
      }
      state.selectedNode = {};
    },
    setSelectedLayout: (state, action) => {
      console.log(action.payload);
      state.selectedLayout = action.payload;
    },
    setSelectedNode: (state, action) => {
      const nodeId = action.payload;
      if (nodeId !== null) {
        state.selectedNode = _.find(state.nodes, node => node.id === nodeId);
      }
      state.selectedEdge = {};
    },
    refreshNodeLabels: (state, action) => {
      const nodeLabelMap = _.mapValues(_.keyBy(action.payload, 'type'), 'field');
      console.log(action.payload, nodeLabelMap);
      state.nodes = state.nodes.map((node: any) => {
        if (node.type in nodeLabelMap) {
          const field = nodeLabelMap[node.type];
          const label = node.properties[field];
          return { ...node, label };
        }
        return node;
      });
    },
  },
});

export const {
  clearGraph,
  addNodes,
  addEdges,
  setGraphGroup,
  setLayoutChanged,
  setNodePositions,
  setSelectedEdge,
  setSelectedLayout,
  setSelectedNode,
  refreshNodeLabels,
} = slice.actions;

const selectSelf = (state: RootState) => state;
export const selectGraph = createSelector(selectSelf, (state) => state.graph);

export default slice.reducer;
