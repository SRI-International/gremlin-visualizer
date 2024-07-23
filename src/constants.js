const SERVER_URL = 'http://localhost:3001';
export const QUERY_ENDPOINT = `${SERVER_URL}/query`;
export const QUERY_RAW_ENDPOINT = `${SERVER_URL}/query-raw`;
export const WORKSPACE_ENDPOINT = `${SERVER_URL}/workspaces`;
export const COMMON_GREMLIN_ERROR = 'Invalid query. Please execute a query to get a set of vertices';

export let GRAPH_IMPL = "vis" // 'vis' | 'cytoscape' | 'sigma'
export const ACTIONS = {
  SET_HOST: 'SET_HOST',
  SET_PORT: 'SET_PORT',
  SET_QUERY: 'SET_QUERY',
  SET_ERROR: 'SET_ERROR',
  SET_NETWORK: 'SET_NETWORK',
  CLEAR_GRAPH: 'CLEAR_GRAPH',
  ADD_NODES: 'ADD_NODES',
  ADD_EDGES: 'ADD_EDGES',
  SET_SELECTED_NODE: 'SET_SELECTED_NODE',
  SET_SELECTED_EDGE: 'SET_SELECTED_EDGE',
  SET_IS_PHYSICS_ENABLED: 'SET_IS_PHYSICS_ENABLED',
  ADD_QUERY_HISTORY: 'ADD_QUERY_HISTORY',
  CLEAR_QUERY_HISTORY: 'CLEAR_QUERY_HISTORY',
  SET_NODE_LABELS: 'SET_NODE_LABELS',
  ADD_NODE_LABEL: 'ADD_NODE_LABEL',
  EDIT_NODE_LABEL: 'EDIT_NODE_LABEL',
  REMOVE_NODE_LABEL: 'REMOVE_NODE_LABEL',
  REFRESH_NODE_LABELS: 'REFRESH_NODE_LABELS',
  SET_NODE_LIMIT: 'SET_NODE_LIMIT'
};

export const DISABLE_NODE_EDGE_EDIT = false;
export const EDGE_ID_APPEND = 'L';
/**
 * To set initial labels to override the default labels, create an entry in the mapping
 * below as per the example.
 */
export const INITIAL_LABEL_MAPPINGS = {
  //  software: 'lang'
}

export const SAVED_QUERIES = {
  // "get node with name marko" : "g.V().has('name', 'marko')",
  // "get person nodes that marko has outgoing edges to" : "g.V().has('name', 'marko').out().hasLabel('person')"
}

