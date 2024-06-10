import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectGraph,
  setSelectedEdge,
  setSelectedNode,
} from '../../reducers/graphReducer';
import { selectOptions } from '../../reducers/optionReducer';
import { getNetwork } from '../../logics/network';
import { Box } from "@mui/material";

export const NetworkGraphComponent = () => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector(selectGraph);
  const { networkOptions } = useSelector(selectOptions);
  const myRef = useRef(null);

  const selectNodeCallback = (params?: any) => {
    const nodeId =
      params.nodes && params.nodes.length > 0 ? params.nodes[0] : null;
    dispatch(setSelectedNode(nodeId));
  };

  const selectEdgeCallback = (params?: any) => {
    const edgeId =
      params.edges && params.edges.length === 1 ? params.edges[0] : null;
    const isNodeSelected = params.nodes && params.nodes.length > 0;
    if (!isNodeSelected && edgeId !== null) {
      dispatch(setSelectedEdge(edgeId));
    }
  };

  useEffect(() => {
    if (myRef.current != null) {
      console.log("getNetwork run = \nnodes = " + nodes);
      getNetwork(
        myRef.current,
        { nodes, edges },
        networkOptions,
        { selectNodeCallback, selectEdgeCallback }
      );
    }
  });
  return <Box className='graph-container' sx={{width: `calc(100% - ${350}px)`}}>
    <div ref={myRef} className={'mynetwork'} />
  </Box>;
};
