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
  nodePosChanges: NodePositions;
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
  nodePosChanges: {},
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

      // get the nodes that have the '_layout' property
      // const layoutNodes = state.nodes
      //   .filter(node => node.properties.hasOwnProperty('layout'));

      // console.log(layoutNodes);

      // for (let node of layoutNodes) {
      //   // get the mapping of layout
      //   // layouts are maps of groups to names
      //   const layoutMap: LayoutsMap = JSON.parse(node.properties['layout']);
      //   const layoutByGroup = layoutMap[state.group];

      //   if (layoutByGroup) {
      //     // get the list of layout names
      //     const names = Object.keys(layoutByGroup);

      //     for (let name of names) {
      //       if (node.id) {
      //         // save the coordinates at layout[group][name] with the node id
      //         state.layouts[name] = {
      //           ...state.layouts[name],
      //           [node.id]: layoutByGroup[name]
      //         };

      //         // if is selected layout, set the coordinates
      //         if (name === state.selectedLayout) {
      //           const nodeIndex = state.nodes.findIndex((n) => n.id === node.id);
      //           state.nodes[nodeIndex].x = layoutByGroup[name].x;
      //           state.nodes[nodeIndex].y = layoutByGroup[name].y;
      //         }
      //       }
      //     }
      //   }
      // }

      // console.log(state.layouts);
    },
    clearGraph: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNode = {};
      state.selectedEdge = {};
      state.nodePosChanges = {};
      state.group = 'default';
    },
    saveLayout: (state, action) => {
      const { name } = action.payload;
      state.layouts[name] = action.payload;
      // state.layouts(action.payload);
    },
    saveNodePosition: (state, action) => {
      const nodeId = action.payload.nodeId;
      state.nodePosChanges[nodeId] = action.payload.pointer;
    },
    setGraphGroup: (state, action) => {
      state.group = action.payload;
    },
    setNodePositions: (state, action) => {
      const nodes = action.payload;
      const keys = Object.keys(nodes);

      for (let id of keys) {
        const ndx = state.nodes.findIndex(n => n.uniqueId === id);
        state.nodes[ndx].x = nodes[id].x;
        state.nodes[ndx].y = nodes[id].y;
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
  saveNodePosition,
  setGraphGroup,
  setNodePositions,
  setSelectedEdge,
  setSelectedLayout,
  setSelectedNode,
  refreshNodeLabels,
} = slice.actions;

const selectSelf = (state: RootState) => state;
export const selectGraph = createSelector(selectSelf, (state) => state.graph);

export default slice.reducer;
