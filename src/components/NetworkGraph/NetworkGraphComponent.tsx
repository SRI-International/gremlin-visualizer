import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectGraph,
} from '../../reducers/graphReducer';
import { selectOptions } from '../../reducers/optionReducer';
import { Box, Button } from "@mui/material";
import { getGraph } from "../../logics/graph";
import { GraphTypes } from "../../logics/utils";

interface NetworkGraphComponentProps {
  panelWidth: number
  retrieveGraph: (graph: GraphTypes) => void
}

export const NetworkGraphComponent = (props: NetworkGraphComponentProps) => {
  const { nodes, edges } = useSelector(selectGraph);
  const { graphOptions } = useSelector(selectOptions);
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current != null) {
      let graph = getGraph(
        myRef.current,
        { nodes, edges },
        graphOptions
      );
      props.retrieveGraph(graph);
    }
  }, [nodes, edges, graphOptions]);

  return <Box className='graph-container' sx={{ width: `calc(100% - ${props.panelWidth}px)` }}>
    <Box ref={myRef} sx={{ height: 'calc(100vh - 20px)' }} className={'mynetwork'} />
  </Box>;
};