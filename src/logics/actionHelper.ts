import { extractEdgesAndNodes } from './utils';
import { addEdges, addNodes } from '../reducers/graphReducer';
import { NodeLabel, addQueryHistory, setNodeLabels } from '../reducers/optionReducer';
import { AppDispatch } from '../app/store';
import {updateNode, updateEdge} from "../reducers/graphReducer"
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

export const updateOnConfirm = (elementType : string | null, updateId: IdType | undefined, result: any, query: string, oldNodeLabels: NodeLabel[], dispatch: AppDispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(
    result.data,
    oldNodeLabels
  );
  if (elementType === "Node") {
    let updatedElement = nodes[0];
    dispatch(updateNode({updateId, updatedElement}));
  }
  else {
    let updatedElement = edges[0];
    dispatch(updateEdge({updateId, updatedElement}));
  }
  dispatch(addQueryHistory(query));
};

