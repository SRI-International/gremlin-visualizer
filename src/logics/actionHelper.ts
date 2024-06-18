import { extractEdgesAndNodes } from './utils';
import { addEdges, addNodes, setSelectedNode, setSelectedEdge } from '../reducers/graphReducer';
import { NodeLabel, addQueryHistory, setNodeLabels } from '../reducers/optionReducer';
import store, { AppDispatch } from '../app/store';
import { updateNode, updateEdge } from "../reducers/graphReducer"
import { IdType } from "vis-network";

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
    let updatedElement = edges[0];
    store.dispatch(updateEdge({ updateId, updatedElement }));
  }
  store.dispatch(addQueryHistory(query));
};

export const manualAddNode = (result: any, oldNodeLabels: NodeLabel[], dispatch: AppDispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(
    result,
    oldNodeLabels

  );
  dispatch(addNodes(nodes));
  dispatch(setNodeLabels(nodeLabels));
  dispatch(setSelectedNode(nodes[0].id));
}

export const manualAddEdge = (result: any, oldNodeLabels: NodeLabel[], dispatch: AppDispatch) => {
  const { nodes, edges} = extractEdgesAndNodes(
    result,
    oldNodeLabels
  );
  dispatch(addNodes(nodes));
  dispatch(addEdges(edges));
  dispatch(setSelectedEdge(edges[0].id));
}


