import { extractEdgesAndNodes } from './utils';
import { addEdges, addNodes } from '../reducers/graphReducer';
import { NodeLabel, addQueryHistory, setIsPhysicsEnabled, setNodeLabels } from '../reducers/optionReducer';
import { AppDispatch } from '../app/store';
import { getNetwork } from './network';
import { EdgeOptions } from 'vis-network';

export const onFetchQuery = (result: any, query: string, oldNodeLabels: NodeLabel[], dispatch: AppDispatch) => {
  const { nodes, edges, nodeLabels } = extractEdgesAndNodes(
    result.data,
    oldNodeLabels
  );
  dispatch(addNodes(nodes));
  dispatch(addEdges(edges));
  dispatch(setNodeLabels(nodeLabels));
  dispatch(addQueryHistory(query));
  
  // dispatch(setIsPhysicsEnabled(true));
  // setTimeout(() => {const network = getNetwork();
  //   console.log(network);    
  
  //   if (network) {
  //     const edges: EdgeOptions = {
  //       smooth: {
  //         enabled: true,
  //         roundness: 10,
  //         type: 'dynamic',
  //       },
  //     };
  //     network.setOptions({ physics: true, edges });
      
  //     setTimeout(() => {
  //       network.fit();
  //     }, 2000)
    
  // }
  
  // }, 100);
};
