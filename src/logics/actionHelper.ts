import { extractEdgesAndNodes } from './utils';
import { addEdges, addNodes, setSelectedEdge, setSelectedNode, updateEdge, updateNode } from '../reducers/graphReducer';
import { addQueryHistory, NodeLabel, selectOptions, setNodeLabels } from '../reducers/optionReducer';
import store, { AppDispatch } from '../app/store';
import { IdType } from "vis-network";
import axios from 'axios';
import { COMMON_GREMLIN_ERROR, QUERY_ENDPOINT } from '../constants';
import { useSelector } from 'react-redux';
import { selectGremlin, setError } from '../reducers/gremlinReducer';
import { useDispatch } from "react-redux";
import { connectionConfig } from './graphImpl/cytoImpl';

export const onFetchQuery = (result: any, query: string, oldNodeLabels: NodeLabel[], dispatch: AppDispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(
    result.data,
    oldNodeLabels
  );

  dispatch(addNodes(nodes));
  dispatch(addEdges(edges));
  dispatch(setNodeLabels(nodeLabels));
  dispatch(addQueryHistory(query));
};

export const updateOnConfirm = (elementType: string | null, updateId: IdType | undefined, result: any, query: string, oldNodeLabels: NodeLabel[]) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(
    result.data,
    oldNodeLabels
  );
  if (elementType === "Node") {
    let updatedElement = nodes[0];
    store.dispatch(updateNode({ updateId, updatedElement }));
  } else {
    let updatedElement = edges.find(e => e.id == updateId);
    store.dispatch(updateEdge({ updateId, updatedElement }));
  }
  store.dispatch(addQueryHistory(query));
};

export const manualAddElement = (isNode: boolean, result: any, oldNodeLabels: NodeLabel[], dispatch: AppDispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(
    result,
    oldNodeLabels
  );
  if (isNode) {
    dispatch(addNodes(nodes));
    dispatch(setNodeLabels(nodeLabels));
    dispatch(setSelectedNode(nodes[0].id));
  } else {
    dispatch(addNodes(nodes));
    dispatch(addEdges(edges));
    dispatch(setSelectedEdge(edges[0].id));
  }
}

export const deleteNode = (id: string, config: connectionConfig | null) => {
  const query = `g.V('${id}').drop()`;
  if (config == null) {
    console.warn("axiosConfig in cytoimpl not set")
    return;
  }
  const host = config.host;
  const port = config.port;
  const nodeLimit = config.nodeLimit;
  const dispatch = config.dispatch;
  axios
    .post(
      QUERY_ENDPOINT,
      {
        host,
        port,
        query,
        nodeLimit,
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then((_response) => {
    })
    .catch((error) => {
      console.warn(error)
      dispatch(setError(COMMON_GREMLIN_ERROR));
    });
}



