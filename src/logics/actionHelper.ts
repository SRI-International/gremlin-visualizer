import { extractEdgesAndNodes } from './utils';
import { addEdges, addNodes } from '../reducers/graphReducer';
import { NodeLabel, addQueryHistory, setNodeLabels } from '../reducers/optionReducer';
import { AppDispatch } from '../app/store';
import {updateNode} from "../reducers/graphReducer"
import { IdType } from "vis-network";

export const onFetchQuery = (result: any, query: string, oldNodeLabels: NodeLabel[], dispatch: AppDispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(
    result.data,
    oldNodeLabels
  );
  console.log(nodes);
  dispatch(addNodes(nodes));
  dispatch(addEdges(edges));
  dispatch(setNodeLabels(nodeLabels));
  dispatch(addQueryHistory(query));
};

export const updateOnFetchQuery = (updateNodeId: IdType | undefined, result: any, query: string, oldNodeLabels: NodeLabel[], dispatch: AppDispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(
    result.data,
    oldNodeLabels
  );

  dispatch(updateNode({updateNodeId, nodes}));
  dispatch(addNodes(nodes));
  dispatch(addEdges(edges));
  dispatch(setNodeLabels(nodeLabels));
  dispatch(addQueryHistory(query));
};

