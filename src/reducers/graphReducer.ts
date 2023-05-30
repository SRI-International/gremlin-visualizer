// import vis from 'vis-network';
import { AnyAction, ThunkAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { Edge, Node } from 'vis-network';
import { RootState } from '../app/store';
import _ from 'lodash';
import { EdgeData, NodeData } from '../logics/utils';
import { MutationActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate';

type Coordinates = {
  x: number;
  y: number;
};

type GraphState = {
  nodes: NodeData[];
  edges: EdgeData[];
  selectedNode?: NodeData;
  selectedEdge?: EdgeData;
  selectedLayout?: string;
  groups: string[];
  layouts: { [key: string]: LayoutJson; };
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
  groups: string[];
  nodes: NodePositions;
};

const initialState: GraphState = {
  nodes: [],
  edges: [],
  selectedNode: { uniqueId: '' },
  selectedEdge: {},
  groups: [],
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
    addLayoutPositions: (state, action) => {
      try {
        const { name, groups, nodes } = action.payload;
        state.layouts[name] = { groups, nodes };
      } catch (err) {
        console.log(err);
      }
    },
    clearLayouts: (state) => {
      state.layouts = {};
    },
    clearGraph: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNode = {};
      state.selectedEdge = {};
      state.groups = [];
      state.selectedLayout = undefined;
      state.layoutChanged = false;
    },
    saveLayout: (state, action) => {
      const { name } = action.payload;
      state.layouts[name] = action.payload;
      // state.layouts(action.payload);
    },
    setGraphGroup: (state, action) => {
      state.groups = action.payload;
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
  clearLayouts,
  addNodes,
  addEdges,
  addLayoutPositions,
  setGraphGroup,
  setLayoutChanged,
  setNodePositions,
  setSelectedEdge,
  setSelectedLayout,
  setSelectedNode,
  refreshNodeLabels,
} = slice.actions;


export const changeLayout =
  (layoutName: string, sendQuery: (query: string, callback: () => void) => void): ThunkAction<void, RootState, unknown, AnyAction> =>
    (dispatch, getState) => {
      const { graph, gremlin } = getState();
      const { layouts } = graph;
      const { nodes, groups } = layouts[layoutName]

      dispatch(clearGraph());
      dispatch(setSelectedLayout(layoutName));
      dispatch(setGraphGroup(groups));

      const str = groups.map((gr) => `'${gr}'`).join(',');
      const query = `${gremlin.queryBase}.V()`;
      const groupQuery = groups.length > 0 ? `.has('groups', within(${str}))` : '';
      sendQuery(`${query}${groupQuery}`, () => {
        dispatch(setNodePositions(nodes));
      });
    };

const selectSelf = (state: RootState) => state;
export const selectGraph = createSelector(selectSelf, (state) => state.graph);

export default slice.reducer;
